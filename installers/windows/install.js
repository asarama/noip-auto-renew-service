const 
  config  = require('../../config'),
  Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
    name:`NoIp Auto Renew Service`,
    description: 'Mock browser service to renew noip hostnames.',
    script: `${__dirname}/../../app.js`,
    wait: 2,
    grow: .5,
    maxRetries: 3,
    maxRestarts: 3,
    nodeOptions: []
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', () => {
  svc.start();
});

svc.install();