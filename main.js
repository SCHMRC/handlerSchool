// Modules to control application life and create native browser window

const { app, BrowserWindow, session } = require('electron')
const path = require('node:path')


const createWindow = () => {
   // Create the browser window.
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}
// Questo metodo verrà chiamato quando Electron avrà finito
// inizializzazione ed è pronto per creare finestre del browser.
// Alcune API possono essere utilizzate solo dopo che si è verificato questo evento.

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['*']
      }
    })
  })


  // createWindow()
  // Su macOS è normale ricreare una finestra nell'app quando
  // si fa clic sull'icona del dock e non ci sono altre finestre aperte.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Esce quando tutte le finestre sono chiuse, tranne su macOS. Lì è comune
// affinché le applicazioni e la relativa barra dei menu rimangano attive finché l'utente non esce
// esplicitamente con Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In questo file puoi includere il resto del processo principale specifico della tua app
// codice. Puoi anche inserirli in file separati e richiederli qui.
