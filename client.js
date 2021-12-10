const socket = io() 
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
const passkey = '123'
let uid=getHash(passkey)
let pass;

do{
    pass=prompt('Enter a passkey: ')
    if(pass===passkey){
        do{
             name = prompt('What is your name? ')
         } while(!name)
        }else{
                pass=''
             }
        }while(!pass)
        
    textarea.addEventListener('keyup', (e) => {
        if(e.target.value.trim().length >0){
        if(e.key === 'Enter'){
                sendMessage(e.target.value)
            }
    }
    else{
    alert("Please Enter message")
    }
})
    
function sendMessage(message) {
    var dateTime = dateTimeFunction()
    let msg = {
        user: name,
        message:message.trim(),
        date:dateTime
    }

    let arr=[]
    let msg1=window.localStorage.getItem(uid);
    if(msg1==null){
        arr[0]=msg
        window.localStorage.setItem(uid,JSON.stringify(arr));
    }
    else{
        msg1=JSON.parse(msg1)
        for(let i=0; i<msg1.length; i++){
            arr.push(msg1[i])
        }
        arr.push(msg)
        window.localStorage.setItem(uid,JSON.stringify(arr));
    }

    appendMessage(msg,'outgoing')

    textarea.value = ''

    // Send to Server
    socket.emit('message',msg)
}

function appendMessage(msg,type){
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className,'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)     
}

//Recieve Message
socket.on('message',(msg) => {
    appendMessage(msg,'incoming')
})

function getHash(input){
    var hash = 0, len = input.length;
    for (var i = 0; i < len; i++) {
      hash  = ((hash << 4) - hash) + input.charCodeAt(i);
      hash |= 0; // to 32bit integer
    }
    return hash;
  }

function dateTimeFunction(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime
    }

window.onload = function() {
    var reloading = localStorage.getItem(uid);
    var reload = JSON.parse(reloading)
    for(let i=0;i<reload.length;i++){
        let msg2={
            user:reload[i].user,
            message:reload[i].message.trim(),
        }
        if(name==reload[i].user){
                appendMessage(msg2,'outgoing')
            }
            else{
                appendMessage(msg2,'incoming')
            }
        }
}
