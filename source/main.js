const settings = require('./app/resources/static_config/base.json');
const electron = require('electron')
const Menu = electron.Menu
const globalShortcut = electron.globalShortcut
// const dialog = electron.dialog


// var rendrer = require("./app/renderer.js")


// window.ipc = window.ipc || {}
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow



const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let contents;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow(settings.app.window);
  contents = mainWindow.webContents;
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname+"/app/", 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    console.log("Event Sender");
    if (files) event.sender.send('selected-directory', files)
  })
})

// console.log(electron.remote)

let template = [
  {
    label: 'File',
    submenu: [{
      label: 'Open',
      accelerator: 'CmdOrCtrl+O',
      click: function (item, focusedWindow) {
        const { dialog } = require('electron')
        var file = dialog.showOpenDialog({ properties: ['openFile', "multiSelection"] })
        console.log(file);
      }
    }
      , {
      label: 'Open Directory',
      accelerator: 'Shift+CmdOrCtrl+O',
      click: function (item, focusedWindow) {
        const { dialog } = require('electron')
        var dir = dialog.showOpenDialog({ properties: ['openDirectory'] })
        console.log(dir);

        contents.executeJavaScript('makeList("' + dir[0].replace(/\\/g, '/') + '");', true);
      }
    }]
  }, {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          // on reload, start fresh and close any old
          // open secondary windows
          if (focusedWindow.id === 1) {
            BrowserWindow.getAllWindows().forEach(function (win) {
              if (win.id > 1) {
                win.close()
              }
            })
          }
          focusedWindow.reload()
        }
      }
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: (function () {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      })(),
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    }]
  }
]



function addUpdateMenuItems(items, position) {
  if (process.mas) return

  const version = electron.app.getVersion()
  let updateItems = []

  items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem() {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem
  menu.items.forEach(function (item) {
    if (item.submenu) {
      item.submenu.items.forEach(function (item) {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item
        }
      })
    }
  })
  return reopenMenuItem
}

if (process.platform === 'darwin') {
  const name = electron.app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: `About ${name}`,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Services',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: `Hide ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: 'Show All',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function () {
        app.quit()
      }
    }]
  })

  // Window menu.
  template[3].submenu.push({
    type: 'separator'
  }, {
      label: 'Bring All to Front',
      role: 'front'
    })

  addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu
  addUpdateMenuItems(helpMenu, 0)
}

app.on('ready', function () {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  globalShortcut.register('CommandOrControl+N', function () {
    console.log("Shourtcut")
    contents.executeJavaScript('playNextMusic()', true);
  });

  globalShortcut.register('MediaPlayPause', function () {
    contents.executeJavaScript('playControlls()', true);
  });

  globalShortcut.register('CommandOrControl+Alt+P', function () {
    contents.executeJavaScript('playControlls()', true);
  });

  globalShortcut.register('MediaNextTrack', function () {
    contents.executeJavaScript('playNextMusic()', true);
  });

  globalShortcut.register('MediaPreviousTrack', function () {
    contents.executeJavaScript('playPrevMusic()', true);
  });

  // globalShortcut.register('MediaStop', function () {
  //   contents.executeJavaScript('playPrevMusic()', true);
  // });

  globalShortcut.register('CommandOrControl+Alt+Right', function () {
    contents.executeJavaScript('playNextMusic()', true);
  });

  globalShortcut.register('CommandOrControl+Alt+Left', function () {
    contents.executeJavaScript('playPrevMusic()', true);
  });


})

app.on('browser-window-created', function () {
  let reopenMenuItem = findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function () {
  let reopenMenuItem = findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = true
})

app.on('open-file', function (event, filePath) {
  event.preventDefault();
  console.log(filePath);

  contents.executeJavaScript('console.log("' + filePath + '")', true);
  contents.executeJavaScript('playNextMusic("' + filePath + '",0)', true);
});