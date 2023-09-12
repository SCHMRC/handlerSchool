const {addLi} = require('./util')


// Tutte le API Node.js sono disponibili nel processo di precaricamento.
// Ha la stessa sandbox di un'estensione Chrome.

window.addEventListener('DOMContentLoaded', () => {
  let dom = document;

  if(localStorage.getItem('lista')){
    let listaStorage = JSON.parse(localStorage.getItem('lista'))
    let ul = dom.querySelector('#lista')
    listaStorage.forEach(item => {
      addLi(ul,item)
    });

  }else{
    console.log(2)
  }
})
