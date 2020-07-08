const
    Browser = require('./src/browser'),
    config = require('./config'),
    definitions = require('./src/definitions'),
    schedule = require('node-schedule')

// Main process
const init = async () => {
    // Main script
    const browser = new Browser()
    const page = await browser.create_page()
    
    // Navigate to noip login page
    await page.navigate(definitions.urls.login)

    // Login
    await page.fill_input_field(definitions.selectors.username, config.no_ip.username)
    await page.fill_input_field(definitions.selectors.password, config.no_ip.password)
    await page.click_button(definitions.selectors.login_button)

    // TODO: Handle failed logins
    // Caused by:
    //  Bad credentials
    //  Too many login attempts

    await page.navigate(definitions.urls.hostnames, 2000)
    await update_hostnames(page)

    setTimeout(async () => {

        await browser.close()

    }, 30 * 1000)
    
}

// Opens each hostname modal and then clicks the update hostname button
const update_hostnames = async (page, throw_error=false) => {

    // Confirm element exists
    if (!await page.element_exists(definitions.selectors.hostname_table)) {
        throw new Error(`Could not find hostname table`)
    }

    let find_hostname_links_response
    
    try {

        find_hostname_links_response = await page.source.evaluate( async (selectors) => {

            const
                delay = 5000, 
                elements = document.querySelectorAll(selectors.hostname_links)

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

                    }, 1000, selectors.update_hostname_button);

                }, timeout_value, element)

            }

        }, definitions.selectors)

        return find_hostname_links_response

    } catch(err) {

        console.error(err)

        if (throw_error) {
            throw new Error(`Unknown error`)
        }
        
        return []
        
    }

}


if (config.debug_mode) {
    init()
}

const job = schedule.scheduleJob(config.cron_string, init)