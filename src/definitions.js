const config = require("../config")

module.exports = {
    default_timeout: 5 * 1000,
    urls: {
        login: "https://www.noip.com/login?ref_url=console",
        hostnames: "https://my.noip.com/#!/dynamic-dns",
    },
    selectors: {
        username: "#clogs > input[name='username']",
        password: "#clogs > input[name='password']",
        login_button: "#clogs > button[name='Login']",
        hostname_table: "#host-panel > table",
        hostname_links: ".table-striped-row > .word-break-col > a.text-info",
        update_hostname_button: "#content-wrapper div.modal-footer > button.btn.btn-170.btn-flat.btn-success.btn-round-corners.pr-sm.ml-sm-30",
        confirm_hostname_buttons: "#host-panel > table > tbody > tr > td.text-right-md > button.btn-confirm"
    },
    browser_launch_options: {
        headless: config.debug_mode ? false : true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
}
