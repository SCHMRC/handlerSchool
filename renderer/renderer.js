const {addLi} = require('./util')



function test() {
  console.log(process.cwd())
  // Ottieni il riferimento all'elemento del form
  var form = document.querySelector('#form-url');

  // Ottieni i valori degli input all'interno del form
  var urlValue = form.querySelector('#url').value;
  var criteriaValue = form.querySelector('#criteria').value;

  // Crea un nuovo oggetto con i valori del form
  var nuovoElemento = { url: urlValue, criteria: criteriaValue };

  storage(nuovoElemento)

  let lista = document.querySelector('#lista');
  addLi(lista,nuovoElemento)

}


function storage(obj){
  if(localStorage.getItem('lista')){
    let listaStorage = JSON.parse(localStorage.getItem('lista'));
    listaStorage.push(obj);
    localStorage.setItem('lista', JSON.stringify(listaStorage));
  }else{
    localStorage.setItem('lista', JSON.stringify([obj]));
  }
}

module.exports = {storage}

