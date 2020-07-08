String.prototype.repeat = function(num) {
    return new Array( num + 1 ).join( this );
}

String.prototype.copy = function() {
    return this.repeat(1)
}

const pad_string = (input_string, minimum_string_length, padding_character="0", prepend=true) => {

    let return_string = new String(input_string).copy()

    let string_length_delta = minimum_string_length - return_string.length

    while (string_length_delta > 0) {

        if (prepend) {
            return_string = padding_character + return_string
        } else {
            return_string = return_string + padding_character
        }

        string_length_delta--
    }

    return return_string

}

const create_timestamp = () => {
    const date_instance = new Date()

    let timestamp = ''

    timestamp += pad_string(date_instance.getUTCFullYear(), 4, "0")
    timestamp += pad_string(date_instance.getUTCMonth(), 2, "0")
    timestamp += pad_string(date_instance.getUTCDate(), 2, "0")
    timestamp += pad_string(date_instance.getUTCHours(), 2, "0")
    timestamp += pad_string(date_instance.getUTCMinutes(), 2, "0")
    timestamp += pad_string(date_instance.getUTCSeconds(), 2, "0")
    timestamp += pad_string(date_instance.getUTCMilliseconds(), 3, "0")

    return timestamp
}

const timeout = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const sleep = async (delay, fn, ...args) => {
    await timeout(delay);
    return fn(...args);
}

module.exports = {
    pad_string,
    create_timestamp,
    timeout,
    sleep
}