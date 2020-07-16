const
    Browser = require('./src/browser'),
    config = require('./config'),
    definitions = require('./src/definitions'),
    schedule = require('node-schedule')
const { timeout } = require('./src/helpers')

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
    
    if (config.no_ip.update_hostnames) {
        await update_hostnames(page)
    }
    
    if (config.no_ip.confirm_hostnames) {
        await confirm_hostnames(page)
    }

    await timeout(5000)
    await browser.close()
    
}

// Clicks the confirm hostname button
const confirm_hostnames = async (page, throw_error=false) => {

    // Confirm element exists
    if (!await page.element_exists(definitions.selectors.hostname_table)) {
        throw new Error(`Could not find hostname table`)
    }

    try {

        await page.source.evaluate( async (selectors) => {

            const wait = async (timeout) => {
                return new Promise((resolve) => {
                    setTimeout(resolve, timeout)
                })
            }

            const elements_to_click = document.querySelectorAll(selectors.confirm_hostname_buttons)

            for (let element_counter = 0; element_counter < elements_to_click.length; element_counter++) {

                const element_to_click = elements_to_click[element_counter]

                await wait(5000)
                // Click the confirm hostname button
                element_to_click.click()

            }

            console.log("Confirmed Hostnames")

        }, definitions.selectors)

        return true

    } catch(err) {

        console.error(err)

        if (throw_error) {
            throw new Error(`Unknown error`)
        }
        
        return false
        
    }

}

// Opens each hostname modal and then clicks the update hostname button
const update_hostnames = async (page, throw_error=false) => {

    // Confirm element exists
    if (!await page.element_exists(definitions.selectors.hostname_table)) {
        throw new Error(`Could not find hostname table`)
    }
    
    try {

        await page.source.evaluate( async (selectors) => {

            const wait = async (timeout) => {
                return new Promise((resolve) => {
                    setTimeout(resolve, timeout)
                })
            }

            const elements = document.querySelectorAll(selectors.hostname_links)

            for (let element_counter = 0; element_counter < elements.length; element_counter++) {

                const element = elements[element_counter]

                await wait(5000)
                // Open the update modal
                element.click()

                await wait(1000)
                // Select and click the update hostname button
                const update_hostname_button = document.querySelector(selectors.update_hostname_button)
                update_hostname_button.click()

            }

            console.log("Updated Hostnames")

        }, definitions.selectors)

        return true

    } catch(err) {

        console.error(err)

        if (throw_error) {
            throw new Error(`Unknown error`)
        }
        
        return false
        
    }
}


if (config.debug_mode) {
    init()
}

const job = schedule.scheduleJob(config.cron_string, init)