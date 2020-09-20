module.exports = {
    debug_mode: false,
    cron_string: "30 2 * * *",
    no_ip: {
        update_hostnames: true,
        confirm_hostnames: true,
        username: "sample_username@example.com",
        password: "sample_password",
    },
    service: {
        name: "NoIp Renew - test.com",
        email: {
            from: "test@secureserver.com",
            to: "test@secureserver.com",
            config: {
                host: "smtp.secureserver.com",
                port: 587,
                secure: false,
                auth: {
                    user: "test",
                    pass: "password"
                }
            },
        }
    },
    default_timeout: 10 * 1000 // Ten seconds
}