const {remote, Notification} = require('electron');

console.log(`> Module: ${__filename}`);
module.exports = Notification || remote.Notification