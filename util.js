
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
        console.log('ok')
        getCopernico(result,item.criteria)
      }
    })
  });

  crossFlag(cross,item,dom)


  span.title = item.criteria
  cross.className = 'cross'
  li.appendChild(dom.createTextNode('URL: '))
  li.appendChild(span)
  li.appendChild(cross)
  ul.appendChild(li)
}

function crossFlag(cross,item,dom){
  cross.addEventListener('click',()=>{
    let lista = new Array(...JSON.parse(localStorage.getItem('lista')))
    let index = lista.findIndex(obj=> obj.url == item.url);
    lista.splice(index,1)
    console.log(lista)
    localStorage.clear()
    localStorage.setItem('lista',JSON.stringify(lista))
    let ul = dom.querySelector('#lista')
    var delChild = ul.lastChild;
    while (delChild) {
      ul.removeChild(delChild);
      delChild = ul.lastChild;
      }
    lista.forEach(item => {
      addLi(ul,item)
    });


  })
}

async function getUrl(url){
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
  let obj = reduceBody(dom,result)
  let hrefList = obj.hrefList
  let containerBody = obj.containerBody
  hrefList.forEach(element => {
    let x = element.slice(0,element.indexOf('\"'))
    if(x.includes('.pdf')){
      containerBody.append(createItem(dom,x))
    }
  });
}

function reduceBody(dom,result){
  let containerBody = dom.getElementById('container-body')
  if(containerBody.childElementCount != 0){
    containerBody.innerHTML = ""
  }
  let res = new String(result)
  let start = res.indexOf('<body')
  let end = res.indexOf('</body>')
  let substring = res.substring(start,end)
  let hrefList = substring.split('href=\"')// > 1 criterio di divisibilità
  return {hrefList,containerBody}
}

function createItem(dom,url){
  let a = dom.createElement('a')
  a.setAttribute('href',url)
  a.setAttribute('class','item')
  a.setAttribute('target','_blank')
  a.setAttribute('title',url)
  let lastIndex = url.lastIndexOf('/')
  a.innerText = url.slice(lastIndex+1,url.length)
  return a
}



function getCopernico(result,criteria){
  let dom = document;
  let obj = reduceBody(dom,result)
  let hrefList = obj.hrefList.filter(item=>item.includes('com-n-'))// > 2 predicato

  const promises = hrefList.map(async (item) => {
    const i = item.indexOf('"');
    const url = item.substring(0, i);
    const response = await getUrl(url);
    return response;
  });

  Promise.all(promises)
  .then((responses) => {
    responses.forEach((response) => {
      const start = response.indexOf('<body');
      const end = response.indexOf('</body>');
      const bodyContent = response.substring(start, end);
      const links = bodyContent.split('href="');

      links.forEach((link) => {
        const x = link.slice(0, link.indexOf('"'));
        if (x.includes('.pdf') && x.includes('comunicazioni')) {// > 3 predicato
          obj.containerBody.append(createItem(dom,x));
        }
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });




  //div.media-content
}



module.exports = {addLi,getUrl}
