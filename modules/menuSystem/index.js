console.log(`> Module: ${__filename}`);
module.exports = class {
    constructor(Menu) {
        this.menu = Menu;
    }
    Bar() {
        this.menu.setApplicationMenu(this.menu.buildFromTemplate(require('./templateBar')));
    }
    Tray(menuTray) {
        menuTray.setToolTip(require('../../package.json').displayName || '');
        menuTray.setContextMenu(this.menu.buildFromTemplate(require('./templateTray')));
    }
}