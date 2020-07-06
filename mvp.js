const puppeteer = require('puppeteer');
const { no_ip } = require('./config');

const 
    DEFAULT_TIMEOUT = 5 * 1000,
    noip_urls = {
        login: "https://www.noip.com/login?ref_url=console",
        hostnames: "https://my.noip.com/#!/dynamic-dns",
    },
    noip_selectors = {
        username: "#clogs > input[name='username']",
        password: "#clogs > input[name='password']",
        login_button: "#clogs > button[name='Login']",
        hostname_table: "#host-panel > table",
        hostname_links: ".table-striped-row > .word-break-col > a.text-info",
        update_hostname_button: "#content-wrapper div.modal-footer > button.btn.btn-170.btn-flat.btn-success.btn-round-corners.pr-sm.ml-sm-30",
    },
    config = require('./config');

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

let browser_launch_options = {
    headless: config.debug_mode ? false : true
};

let 
    session_timestamp = create_timestamp(),
    navigation_counter = 0;

let navigate = async (page, url, extra_delay=null) => {
    await page.goto(url, { waitUntil: 'networkidle2' });

    if (config.debug_mode) {
        await page.screenshot({path: `./debugging/${session_timestamp}-${navigation_counter}.png`});
        navigation_counter++;
    }

    if (extra_delay) {
        await timeout(extra_delay)
    }
    
};

// Higher level methods

const element_exists = async (page, selector, throw_error=false) => {
    
    let wait_for_response
    
    try {

        wait_for_response = await page.waitForSelector(selector)
        return true

    } catch(err) {

        console.error(err)

        if (throw_error) {
            throw new Error(`Could not find element with selector "${selector}"`)
        }
        
        return false
        
    }
}

const set_element_value = async (page, selector, value, throw_error=false) => {
    
    let set_value_response
    
    try {

        set_value_response = await page.evaluate((selector, value) => {
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


const fill_input_field = async (page, selector, value) => {

    // Confirm element exists
    if (!await element_exists(page, selector)) {
        throw new Error(`Could not find element to fill with selector "${selector}"`)
    }

    const set_value_response = await set_element_value(page, selector, value)

    if (!set_value_response) {
        throw new Error(`Could not set value for element with selector "${selector}"`)
    }

}

const click_button = async (page, selector) => {

    // Confirm element exists
    if (!await element_exists(page, selector)) {
        throw new Error(`Could not find element to fill with selector "${selector}"`)
    }

    try {
        await page.click(selector)
    } catch(err) {
        throw new Error(`Could not click button with selector "${selector}"`)
    }

}

const update_hostnames = async (page, throw_error=false) => {


    // Confirm element exists
    if (!await element_exists(page, noip_selectors.hostname_table)) {
        throw new Error(`Could not find hostname table`)
    }

    let find_hostname_links_response
    
    try {

        find_hostname_links_response = await page.evaluate( async (noip_selectors) => {

            const
                delay = 5000, 
                elements = document.querySelectorAll(noip_selectors.hostname_links)

            for (let delay_counter = 0; delay_counter < elements.length; delay_counter++) {

                const 
                    element = elements[delay_counter],
                    timeout_value = delay_counter * delay

                setTimeout(async (element) => {

                    // Open the update modal
                    element.click()

                    // Click the update hostname button
                    setTimeout(async (update_hostname_button_selector) => {

                        const update_hostname_button = document.querySelector(update_hostname_button_selector)
                        update_hostname_button.click()

                    }, 1000, noip_selectors.update_hostname_button);

                }, timeout_value, element)

            }

        }, noip_selectors)

        return find_hostname_links_response

    } catch(err) {

        console.error(err)

        if (throw_error) {
            throw new Error(`Unknown error`)
        }
        
        return []
        
    }

}

// Main script
(async () => {
    const browser = await puppeteer.launch(browser_launch_options);
    const page = await browser.newPage();
    
    // Set default timeout to 5 seconds
    page.setDefaultTimeout(DEFAULT_TIMEOUT)

    // Navigate to noip login page
    await navigate(page, noip_urls.login);

    // Fill in username and password
    await fill_input_field(page, noip_selectors.username, config.no_ip.username)
    await fill_input_field(page, noip_selectors.password, config.no_ip.password)
    await click_button(page, noip_selectors.login_button)

    // TODO: Handle failed logins
    // Caused by:
    //  Bad credentials
    //  Too many login attempts

    // Find host names
    // Count hostnames
    // For each hostname
    //   click link
    //   click Update Hostname button
    await navigate(page, noip_urls.hostnames, 2000)
    
    await update_hostnames(page)

    setTimeout(async () => {

        await browser.close()

    }, 30 * 1000)
    
})();

