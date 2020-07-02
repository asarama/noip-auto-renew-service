const puppeteer = require('puppeteer');

const 
    noip_urls = {
        login: "https://www.noip.com/login?ref_url=console"
    },
    noip_selectors = {
        username: "#clogs > input[name='username']",
        password: "#clogs > input[name='password']",
    },
    config = require('./config');

String.prototype.copy = () => {
    return this.repeat(1)
}

const pad_string = (input_string, minimum_string_length, padding_character="0", prepend=true) => {

    let return_string = input_string.copy()

    let string_length_delta = minimum_string_length - return_string.length()

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

let browser_launch_options = {
    headless: config.debug_mode ? false : true
};

(async () => {
    const browser = await puppeteer.launch(browser_launch_options);
    const page = await browser.newPage();

    await navigate(page, noip_urls.login);
    await browser.close();
})();

let 
    session_timestamp = create_timestamp(),
    navigation_counter = 0;
let navigate = async (page, url) => {    
    await page.goto(url);

    if (config.debug_mode) {
        await page.screenshot({path: `./debugging/${session_timestamp}-${navigation_counter}.png`});
        navigation_counter++;
    }
    
};