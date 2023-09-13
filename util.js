
function addLi(ul,item){
  let dom = document;
  let li = dom.createElement('li');
  let span = dom.createElement('span')
  let cross = dom.createElement('span')
  span.innerText = item.url
  span.className = 'url'
  li.setAttribute('class','listitem')


  span.addEventListener('click', function() {
    getUrl(item.url).then((result)=>{
      if(item.url.includes('battisti')){
        getBattisti(result,item.criteria)
      }else{
        console.log(2)
      }
    })
  });
  cross.addEventListener('click',()=>{
    let lista = new Array(...JSON.parse(localStorage.getItem('lista')))
    console.log(lista)
    let index = lista.findIndex(obj=> obj.url == item.url);

    console.log(index)
    lista = lista.splice(index,0)
    console.log(lista)
    //localStorage.clear()
    //localStorage.setItem('lista',JSON.stringify(lista))


  })

  span.title = item.criteria
  cross.className = 'cross'
  li.appendChild(dom.createTextNode('URL: '))
  li.appendChild(span)
  li.appendChild(cross)
  ul.appendChild(li)
}

function getUrl(url){
  return new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest();//creo un'istanza XMLHttpRequest
    xhr.open('GET', url);
    xhr.send();
    xhr.onerror = (evt) => { //ascoltiamo un eventuale errore
                          alert("Errore API")
                      }
    xhr.addEventListener('load', (evt) => {
      const result = evt.target.response
      if(result){
        resolve(result)
      }else{
        reject('No Url Found!')
      }
    })

  })
}

function getBattisti(result,criteria){
  let dom = document;
  let containerBody = dom.getElementById('container-body')
  if(containerBody.childElementCount != 0){
    containerBody.innerHTML = ""
  }
  let res = new String(result)
  let temp = res.split('href=\"')
  let hrefList = [];

  temp.forEach(element => {
    let x = element.slice(0,element.indexOf('\"'))
    if(x.includes('.pdf')){
      let a = dom.createElement('a')
      a.setAttribute('href',x)
      a.setAttribute('class','item')
      a.setAttribute('target','_blank')
      a.setAttribute('title',x)
      let lastIndex = x.lastIndexOf('/')
      a.innerText = x.slice(lastIndex+1,x.length)
      containerBody.append(a)
    }
  });




  //console.log(result.includes('post-'))
  //let posts = result.querySelectorAll(criteria)
  // posts = [...posts]
  // posts.forEach(post => {
  //   console.log(post.querySelector('h2').childNodes[0].href)
  // });

}



module.exports = {addLi,getUrl}
