## debug_mode
Runs the renew process on application start up, disables headless mode, and adds detailed logging.

## cron_string
Defines when and how often the renew process should run. For more information on how this is configured take a look [here](https://www.npmjs.com/package/node-schedule#cron-style-scheduling)

## no_ip

### update_hostnames
Opens the hostname edit modal and clicks the update hostname button.

### confirm_hostnames
If your hostname is expiring, clicks the confirm hostname button.

### username
Your NoIp login username.

### password
Your NoIp login password.

## default_timeout
The time our browser waits before considering navigation to a new page a failure.

If you plan to deploy this service on a machine with a slower processor or internet consider increasing this value.