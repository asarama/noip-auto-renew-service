# Depreciated

As of March 25th 2021 noip has implemented a recaptcha check to block bots. I will no longer be maintaining or developing this service further.
# NoIp Auto Renew Service

Deployable service which will renew your expiring noip hostnames.

## TODO:
- ~~MVP Script~~
- ~~Application architecture~~
- ~~Scheduling~~
- ~~Containerization~~
- ~~Windows Service~~
- ~~Simple usage documentation~~
- ~~Logging~~
- Code documentation
- Code review
- Handle error cases
- Add docker browser sandbox

## Requirements
- Node v10.1+

## Setup

```bash
npm i
```

```bash
cp config.example.js config.js
```

Fill out the ```config.js``` parameters. For more information on what each parameter does review ```config.md```.

### Docker (untested)

Note: While running the application using docker make sure the headless_mode property in your config file is set to `false`.

```bash
npm run build
```

```bash
npm run start
```

### Windows Service

On Windows OS you can install this script as a service using the following commands:

```bash
npm i -g node-windows

```

```bash
npm run install-windows

```

## Usage

I do not recommend running this application on it's own without a process manager. Please consider using [PM2](https://pm2.keymetrics.io/)

Regardless you can run start the daemon using:
```bash
npm run up
```
