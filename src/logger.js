const
    config = require('../config'),
    nodemailer = require('nodemailer'),
    schedule = require('node-schedule'),
    fs = require('fs').promises

class Logger {
    
    constructor(options) {
        
        this.file_directory = options.file_directory || (`${__dirname}/logs`)
        this.service_name = options.service_name || config.service.name
        this.email_transporter = nodemailer.createTransport(config.service.email.config)

        //Schedule delete old scripts function once everyday
        this.delete_old_logs_job = schedule.scheduleJob({
            hour: 11,
            minute: 0
        }, () => {this.delete_old_logs()})

        this.delete_ignore_files = [".gitignore"]

    }
    
    //===========\\
    // Interface \\
    //===========\\
    
    /**
    * Logs a message to an error.log file
    * 
    * @param {string} message
    *   Message string to log
    *
    * @return {void}
    */
   
    async error(message) {
        await this.write_out('error.log', message)
    }
    
    /**
    * Logs a message to an info.log file
    *
    * @param {string} message
    *   Message string to log
    *
    * @return {void}
    */

    async info(message) {
        await this.write_out('info.log', message)
    }

    /**
    * Logs a message to a custom filename.
    *
    * @param {string} filename
    *   Name of the file to write to.
    * @param {string} message
    *   Message string to log.
    *
    * @return {void}
    */

    async custom(filename, message) {
        await this.write_out(filename + '.log', message)
    }

    /**
    * Appends a message to a specified file in the file directory stated during 
    * initialization of this class.
    *
    * Note:
    * Here we prepend a time_stamp with the format HH:mm:ss to the message, and
    * a date_stamp to the filename with the format YYYY-MM-DD-
    * We also convert the message to a string
    *
    * @param {String} filename
    *   Name of file to write to.
    * @param {String} message
    *   Message string to log.
    *
    * @return {void}
    */

    async write_out(filename, message) {

        const date_object = this.format_date(new Date())

		try {
            await fs.appendFile(
                this.file_directory + "/" + filename + "-" + date_object.date_stamp, 
				date_object.time_stamp + " " + this.message_to_string(message) + "\r\n"
            )
		} catch (error) {
			throw error
		}
    }

    /**
    * Send an email to our log email.
    *
    * @param {string} message
    *   Message string to email
    *
    * @return {void}
    */

    email(message) {

        let mailOptions = {
            from: config.service.email.from,
            to: config.service.email.to,
            subject: 'Message from Service: ' + this.service_name,
            text: message,
            html: '<p>' + message + '</p>'
        }

        // send mail with defined transport object
        this.email_transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                this.error(error)
                return console.error(error)
            }
        })

    }
    
    //=========\\
    // Helpers \\
    //=========\\

    /**
    * Takes a standard date format and converts it to a date stamp (YYYY-MM-DD) 
    * and a time stamp (HH:mm:ss).
    *
    * @param {Date} date
    *   Date object to convert
    *
    * @return {Object}
    *  Object with two keys date_stamp, and time_stamp
    */
   
    format_date(date) {
        
        //Pad a number to make it two digits
        function pad(number) {
            if (number < 10) {
              return '0' + number
            }
            return number
        }

        const date_stamp = date.getUTCFullYear() +
            '-' + pad(date.getUTCMonth() + 1) +
            '-' + pad(date.getUTCDate())

        const time_stamp = pad(date.getUTCHours()) +
            ':' + pad(date.getUTCMinutes()) +
            ':' + pad(date.getUTCSeconds())

        return {
            date_stamp,
            time_stamp
        }
    }
    
    /**
    * Converts any variable type to a string
    * 
    * @param {mixed} message
    *   Message to convert to string
    *
    * @return {string} converted message to string
    */ 
    
    message_to_string(message) {
        
        switch (typeof message) {
            case "object":
                message = JSON.stringify(message, this.censor(message))
                break
            case "array":
                message.map((item => this.message_to_string(item)))
                break
        }
        
        return message
        
    }

    /**
    * Converts a circular object reference to a string
    *
    * @author: https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
    *
    * @param {mixed} censor
    *   Object to check.
    *
    * @return {mixed} 
	*	converted circular object to string
    */

    censor(censor) {

        let i = 0

        return (key, value) => {

            if(i !== 0 && typeof(censor) === 'object' && typeof(value) === 'object' && censor == value)
                return '[Circular]'

            if(i >= 29) // seems to be a hard maximum of 30 serialized objects?
                return '[Unknown]'

            ++i // so we know we aren't using the original object anymore

            return value

        }
    }

    /**
    * Find all log files that are older than 30 days and delete them
    *
    * @return {void}
    */

    delete_old_logs() {

        //Create a new date for 30 days ago
        const delete_older_than_date_stamp = new Date(new Date() - 1000 * 60 * 60 * 24 * 30)

        //Get all info.log and error.log files
        fs.readdir(this.file_directory, (error, files) => {

            if (error) {
                throw error
            }

            files.forEach(filename => {

                //ignore the .gitignore and other permanent log files defined in delete_ignore_files
                if (!this.delete_ignore_files.includes(filename)) {
                    try {
                        const file_date_string = filename.substring(filename.length - 10, filename.length)

                        //Make sure we have a string that can be turned into a valid date
                        if (!isNaN(Date.parse(file_date_string))) {

                            const file_date = new Date(file_date_string)

                            //If file date is older delete it
                            if ((file_date - delete_older_than_date_stamp) < 0) {
                                fs.unlink(this.file_directory + "/" + filename, error => {
                                    if (error) {
                                        throw error
                                    }
                                })
                            }
                        }
                    } catch (e) {
						this.email(`Issue with deleting log file.`)
                    }
                }
            })
        })
    }
}

module.exports = Logger