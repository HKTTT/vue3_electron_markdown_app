'use strict'

import { app, protocol, BrowserWindow , Menu,dialog,ipcMain} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const path = require('path')
const fs = require('fs')
let file_path = ''
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload:path.join(__dirname,'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  
  const menu = Menu.buildFromTemplate([
    {
      label:'open',
      submenu:[
        {
          label:'openFile',
          click:async ()=>{
            const {canceled,filePaths}  = await dialog.showOpenDialog()
            if (canceled) {
              return
            } else {
              //  console.log(filePaths[0])
              // console.log(path.extname(filePaths[0]) === '.txt')
              if (path.extname(filePaths[0]) !== '.md' && path.extname(filePaths[0]) !== '.txt') {
                return dialog.showErrorBox('文件错误','markdown不支持此类性文件，请选择.md文件或者.txt文件')
              }
              file_path = filePaths[0]
              fs.readFile(filePaths[0],(error,data)=>{
                if (error) {
                  return console.log(error)
                }
                // console.log(data.toString())
                win.webContents.send('md_content',data.toString())
              })
            }
          }
        },
        {
          label:'saveFile',
          click:()=>{
            // console.log('saveFile')
            // await dialog.showSaveDialog({
            //   title:'保存文件',
            //   filters:[{
            //     name:'md文件',extensions:['md']
            //   },
            //   {
            //     name:'txt文件',extensions:['txt']
            //   }
            //   ],
            //   securityScopedBookmarks:true
            // },(filename)=>{
            //   console.log(filename)
            // })
            // 直接写入   不存在另存为
            if (file_path === '') {
              return dialog.showErrorBox('路径错误','没有找到指定路径')
            }
            win.webContents.send('return_content','ok')
            
            // fs.writeFile(file_path,'data',(error)=>{
            //   if (error) {
            //     return console.log('errr')
            //   }
            //     console.log('保存成功')
            // })
          }
        },
        {
          label:'exit',
          click:()=>app.quit()
        }
      ]
    }
  ])
 Menu.setApplicationMenu(menu)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', async () => {
//   // if (isDevelopment && !process.env.IS_TEST) {
//   //   // Install Vue Devtools
//   //   try {
//   //     await installExtension(VUEJS3_DEVTOOLS)
//   //   } catch (e) {
//   //     console.error('Vue Devtools failed to install:', e.toString())
//   //   }
//   // }
 
//   createWindow()

//   ipcMain.on('send_content',(_event,data)=>{
//     console.log(data)
//   })
// })

app.whenReady().then(()=>{

  ipcMain.on('send_content',(_event,value)=>{
    fs.writeFile(file_path,value,(error)=>{
      if (error) {
        return console.log(error)
      }
      dialog.showMessageBox({
        message:"保存成功",
        type:"info"
      })
    })
  })

  createWindow()
  
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
