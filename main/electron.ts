// Module to control the application lifecycle and the native browser window.
import electron, { ipcRenderer } from 'electron';
import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import path from 'path';
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
import './with-dotnet';

let mainWindow: BrowserWindow;

// Create the native browser window.
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        // Set the path of an additional "preload" script that can be used to
        // communicate between node-land and browser-land.
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false,
    });

    // In production, set the initial browser path to the local bundle generated
    // by the Create React App build process.
    // In development, set it to localhost to allow live/hot-reloading.
    const appURL = app.isPackaged
        ? `file://${path.join(__dirname, '/../build/index.html')}`
        : 'http://localhost:3000';
    mainWindow.loadURL(appURL);

    // Automatically open Chrome's DevTools in development mode.
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
    protocol.registerHttpProtocol(
        'file',
        (request, callback) => {
            const url = request.url.substr(8);
            callback({ path: path.normalize(`${__dirname}/${url}`) });
        },
        // (error) => {
        //     if (error) console.error('Failed to register protocol');
        // },
    );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension: ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    setupLocalFilesNormalizerProxy();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = 'https://my-electron-app.com';
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);

        if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
            event.preventDefault();
        }
    });
});

// An example of ipc through contextBridge
ipcMain.on('to-main', (event, args) => {
    console.log("ipcMain.on('to-main')");
    // Do something

    // Send results back to renderer process
    mainWindow.webContents.send('from-main', { msg: 'Hello from Main' });
});

// An example of ipc through contextBridge
ipcMain.on('app-close', (event, args) => {
    console.log("ipcMain.on('app-close')");

    mainWindow.close();
});

const powerMonitor = electron.powerMonitor;

powerMonitor.on('lock-screen', () => {
    mainWindow.webContents.send('system-idle', {});
    console.log('System is about to become locked');
});

powerMonitor.on('unlock-screen', () => {
    mainWindow.webContents.send('system-idle', {});
    console.log('system was unlocked');
});

let systemIdle = false;

setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();
    if (idleTime > 60 * 15 && !systemIdle) {
        systemIdle = true;
        mainWindow.webContents.send('system-idle', {});
        console.log(`system has been idle for ${idleTime} seconds`);
    } else {
        systemIdle = idleTime > 60;
    }
}, 10000);
