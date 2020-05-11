const puppeteer = require('puppeteer');

const 
    noip_urls = {
        login: "https://www.noip.com/login?ref_url=console"
    },
    config = require('./config');



let browser_launch_options = {
    headless: config.debug_mode ? false : true
};

(async () => {
    const browser = await puppeteer.launch(browser_launch_options);
    const page = await browser.newPage();

    await navigate(page, noip_urls.login);
    await browser.close();
})();

let navigation_counter = 0;
let navigate = async (page, url) => {    
    await page.goto(url);

    if (config.debug_mode) {
        await page.screenshot({path: `./debugging/${navigation_counter}.png`});
        navigation_counter++;
    }
};