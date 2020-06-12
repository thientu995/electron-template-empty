const electron = require('electron')
const autoUpdater = electron.autoUpdater
const os = require('os')
const appVersion = require('../../package.json').version

let initialized = false
let updateFeed = null;

console.log(`> Module: ${__filename}`);
module.exports = function (mainWindow) {
    const platform = `${os.platform()}_${os.arch()}`
    const nutsURL = 'electron-template-empty-442dazr6l.now.sh'

    updateFeed = `${nutsURL}/update/${os.platform()}/${appVersion}`
    if (updateFeed == null || updateFeed == '') {
        console.error('Url is not null');
    }
    if (process.platform == 'darwin') {
        console.error('Get code signature for running application');
    }
    if (initialized || !updateFeed) { return }

    initialized = true;

    autoUpdater.on('error', function (ev, err) {
        mainWindow.webContents.send('console', `Error: ${err}`);
    });

    autoUpdater.on('checking-for-update', function (ev, err) {
        mainWindow.webContents.send('console', 'Checking for update');
    });

    autoUpdater.on('update-available', function (ev, err) {
        mainWindow.webContents.send('console', 'Update available');
    });

    autoUpdater.on('update-not-available', function (ev, err) {
        mainWindow.webContents.send('console', 'Update not available');
    });

    autoUpdater.on('update-downloaded', function (ev, err) {
        mainWindow.webContents.send('console', 'Update downloaded');
        // autoUpdater.quitAndInstall();
    });

    autoUpdater.on('before-quit-for-update', function () {
        mainWindow.webContents.send('console', 'Before quit for update');
    });

    try {
        mainWindow.webContents.send('console', updateFeed)
        autoUpdater.setFeedURL(updateFeed);
        autoUpdater.checkForUpdates();
    } catch (ex) {
        mainWindow.webContents.send('console', ex)
        console.error(ex)
    }
}
