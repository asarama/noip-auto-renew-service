const 
    puppeteer = require('puppeteer'),
    definitions = require('./definitions'),
    Page = require('./page')

class Browser {

    constructor() {

        this.source = undefined
        this.pages = []

    }

    async create_browser() {
        this.source = await puppeteer.launch(definitions.browser_launch_options)
    }

    async create_page() {

        if (typeof this.source === "undefined") {
            await this.create_browser()
        }

        const 
            puppeteer_page = await this.source.newPage(),
            page_instance = new Page(puppeteer_page)

        this.pages.push(page_instance)

        return page_instance
    }

    async close() {

        if (typeof this.source !== "undefined") {
            await this.source.close()
        }
        
    }

}

module.exports = Browser