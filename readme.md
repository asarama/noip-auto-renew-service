# NoIp Auto Renew Service

Deployable service which will renew your expiring noip hostnames.

## TODO:
- ~~MVP Script~~
- ~~Application architecture~~
- ~~Scheduling~~
- ~~Containerization~~
- ~~Windows Service~~
- ~~Simple usage documentation~~
- Code documentation

## Setup

```bash
npm i
```

```bash
cp config.example.js config.js
```

Fill out the ```config.js``` parameters. For more information on what each parameter does check ```config.md```

### Docker (untested)

```bash
npm run build
```

```bash
npm run start
```

### Windows Service

On Windows OS you can install this script as a service using the following commands:

```bash
npm i node-windows

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
