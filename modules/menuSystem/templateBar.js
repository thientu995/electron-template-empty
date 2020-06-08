const { app } = require("electron");
const path = require('path');
const dialog = require('../dialog');
module.exports = [
    {
        label: 'Menu',
        submenu: [
            {
                label: 'Text disabled',
                enabled: false
            },
            {
                label: 'Click here will restart app',
                click: () => {
                    dialog.alert('Click OK');
                }
            },
            { type: 'separator' },
            {
                label: 'Edit',
                icon: path.join(__dirname, '../../assets/icon/icon_16.png'),
                submenu: [
                    {
                        label: 'Copy',
                        accelerator: 'CmdOrCtrl+C',
                        role: 'copy'
                    },
                    {
                        label: 'Paste',
                        accelerator: 'CmdOrCtrl+V',
                        role: 'paste'
                    },
                    {
                        label: 'Cut',
                        accelerator: 'CmdOrCtrl+X',
                        role: 'cut'
                    },
                    {
                        label: 'Select All',
                        accelerator: 'CmdOrCtrl+A',
                        role: 'selectall'
                    }
                ]
            }
        ]
    },
    {
        label: 'Quit',
        click: () => {
            app.quit();
        }
    },
    {
        label: 'Exit',
        click: () => {
            app.exit();
        }
    },
    {
        label: 'Restart',
        click: () => {
            app.relaunch();
            app.exit();
        }
    }
]