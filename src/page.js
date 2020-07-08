const 
    config = require('../config'),
    helpers = require('./helpers')


class Page {

    constructor(puppeteer_page) {

        this.source = puppeteer_page
        this.page_timestamp = helpers.create_timestamp()
        this.navigation_counter = 0

        // Set default timeout to 5 seconds
        this.source.setDefaultTimeout(config.default_timeout)

    }

    async close() {
        await this.source.close()
    }

    async click_button(selector) {
        // Confirm element exists
        if (!await this.element_exists(selector)) {
            throw new Error(`Could not find element to fill with selector "${selector}"`)
        }

        try {
            await this.source.click(selector)
        } catch(err) {
            throw new Error(`Could not click button with selector "${selector}"`)
        }
    }

    async navigate(url, extra_delay=null) {
        
        await this.source.goto(url, { waitUntil: 'networkidle2' });

        if (config.debug_mode) {
            await this.source.screenshot({path: `./debugging/${this.page_timestamp}-${this.navigation_counter}.png`});
            this.navigation_counter++;
        }

        if (extra_delay) {
            await helpers.timeout(extra_delay)
        }
    }

    async element_exists(selector, throw_error=false) {

        let wait_for_response
    
        try {
    
            wait_for_response = await this.source.waitForSelector(selector)
            return true
    
        } catch(err) {
    
            console.error(err)
    
            if (throw_error) {
                throw new Error(`Could not find element with selector "${selector}"`)
            }
            
            return false
            
        }

    }    

    async fill_input_field(selector, value) {

        // Confirm element exists
        if (!await this.element_exists(selector)) {
            throw new Error(`Could not find element to fill with selector "${selector}"`)
        }

        const set_value_response = await this.set_element_value(selector, value)

        if (!set_value_response) {
            throw new Error(`Could not set value for element with selector "${selector}"`)
        }

    }

    async set_element_value(selector, value, throw_error=false) {
    
        let set_value_response
        
        try {
    
            set_value_response = await this.source.evaluate((selector, value) => {
                const element = document.querySelector(selector);
    
                if (!element) {
                    throw new Error(`Element with selector "${selector}" not found`)
                    
                }
    
                element.value = value
            }, selector, value)
    
            return true
    
        } catch(err) {
    
            console.error(err)
    
            if (throw_error) {
                throw new Error(`Could not set value of element with selector "${selector}"`)
            }
            
            return false
            
        }
    }

}

module.exports = Page