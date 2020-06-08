// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;

ipcRenderer.on('console', (evt, Msg) => {
    console.log(Msg)
    document.getElementById('msg').innerHTML += '<br>' + Msg;
});

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})