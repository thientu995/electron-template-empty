// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const autoUpdate = require('./modules/autoUpdate');
const dialog = require('./modules/dialog');
const menuSys = require('./modules/menuSystem');
const menuSystem = new menuSys(Menu);
const IsDebug = true;/--debug/.test(process.argv[2]);
let showConfirmCloseApp = true;
let mainWindow = null;
let menuTray = null;

// The launch application will run into the first run() function
run();

/**
 * List event ipcMain
 */
ipcMain.on('Refesh', (event, arg) => {
  dialog.alert('Refesh');
  createWindow();
});

ipcMain.on('Restart', (event, arg) => {
  app.relaunch();
  app.exit();
});

/**
 * The launch application will run into the first run() function
 */

function run() {
  if (process.mas) return
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  }
  else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized())
          mainWindow.restore()
        mainWindow.focus();
      }
    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(() => {
      runInstall();

      createWindow();

      app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
      })
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') app.quit();
    });
  }
}

function createWindow() {
  if (!mainWindow) {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      maximizable: true,
      resizable: true,
      alwaysOnTop: false,
      frame: true,
      webPreferences: {
        devTools: IsDebug,// Relase change value false
        nodeIntegration: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true
      }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Event close windows
    mainWindow.on('close', event => {
      if (showConfirmCloseApp) {
        event.preventDefault();
        dialog.confirm('Do you want to close the application?', function () {
          showConfirmCloseApp = false;
          app.quit();
        });
      }
    });

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    mainWindow.webContents.on('did-finish-load', () => {
      autoUpdate(mainWindow);
    })
  }
  else {
    mainWindow.reload();
    mainWindow.show();
  }

  // add menu
  menuSystem.Bar();
  menuTray = menuTray || new Tray('./assets/icon/icon_16.png');// file icon 16x16 is the best
  menuSystem.Tray(menuTray);

}

function runInstall() {
  if (!IsDebug) {
    // install/uninstall add shortcut desktop, startup, start menu for WINDOWS
    require('./modules/scriptsInstall/win/squirrel_install')(app);
    // clean folder obfuscator (if exists)
    require('./modules/scriptsInstall/obfuscator').clean();
  }
}