module.exports = {
    debug_mode: false,
    cron_string: "30 2 * * *",
    no_ip: {
        update_hostnames: true,
        confirm_hostnames: true,
        username: "sample_username@example.com",
        password: "sample_password",
    },
    default_timeout: 10 * 1000 // Ten seconds
}