import {contextBridge,ipcRenderer} from 'electron'
contextBridge.exposeInMainWorld('electronAPI',{
    getContext:(callback)=>ipcRenderer.on('md_content',callback),
    returnContext:(callback)=>ipcRenderer.on('return_content',callback),
    sendContext:(data)=>ipcRenderer.send('send_content',data)
})