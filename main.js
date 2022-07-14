const {app, BrowserWindow, ipcMain, globalShortcut, Menu} = require('electron')
const fs = require("fs");
const path = require("path");
const printer = require("pdf-to-printer");

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.loadFile('index.html')
    //mainWindow.loadURL('https://www.google.com');
    mainWindow.on('closed', function () {
        mainWindow = null
    });

    globalShortcut.register('CommandOrControl+Shift+D+T', () => {
        mainWindow.webContents.toggleDevTools();
    });

    let _menu = Menu.buildFromTemplate([{
        label: 'File',
        submenu: [
            {
                label: 'Print',
                click: async function() {
                    let stime = new Date();
                    console.log('Start printing');
                    let data = await mainWindow.webContents.printToPDF({});
                    console.log('Total pdf time ', new Date() - stime);
                    stime = new Date();
                    mainWindow.webContents.print({
                        silent: true,
                        printBackground: false,
                        deviceName: 'Brother QL-800'
                    }, (success, error) => {
                        if(error) {
                            console.log(error);
                        }
                        console.log('Total time ', new Date() - stime);
                    });
                }
            }
        ]
    }]);
    Menu.setApplicationMenu(_menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})

