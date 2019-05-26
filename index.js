const electron = require('electron');
const url = require('url');
const path = require('path');

// components
const { app, BrowserWindow, Menu } = electron;

// layout
let mainWindow;
let addWindow;
const mainMenuTemplate = [{
    label: 'File',
    submenu: [
        {
            label: 'Add item',
            accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
            click(){
                createAddWindow();
            }
        },
        {
            label: 'Clear items',
            accelerator: process.platform == 'darwin' ? 'Command+R' : 'Ctrl+R'
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click () {
                app.quit();
            }
        }
    ]
}];

// custom fuctions
const createMenu = () => {
    if(process.platform == 'darwin'){
        mainMenuTemplate.unshift({});
    } else if(process.env.NODE_ENV !== 'production'){
        mainMenuTemplate.push({
            label: 'DevTools',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        });
    }

    // create menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // instert menu
    Menu.setApplicationMenu(mainMenu);
};

// listening window to be ready
app.on('ready', () => {
    // new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    // load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    createMenu();
});

// function for creating add item window
const createAddWindow = () => {
    // new window
    addWindow = new BrowserWindow({
        width: 500,
        height: 300,
        title: 'Add to do item',
        webPreferences: {
            nodeIntegration: true
        }
    });

    // prevent if add window not closed
    mainWindow.on('closed', () => {
        app.quit();
    });

    // load html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // optimize
    addWindow.on('close', () => {
        addWindow = null;
    });
};