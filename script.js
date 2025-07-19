// main.js

// --- Existing code (if any) in main.js would go here ---
// For example, if you had other DOM manipulation or app logic:
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed.');

    // --- WebSocket Code Starts Here ---

    const socketUrl = 'ws://localhost:8080'; // Replace with your WebSocket server URL

    let socket; // Declare socket variable to be accessible globally or within a scope

    function connectWebSocket() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket is already open.');
            return;
        }

        socket = new WebSocket(socketUrl);

        // Event listener for when the connection is established
        socket.onopen = (event) => {
            console.log('WebSocket connection established:', event);
            // You can send a message to the server immediately after connecting
            socket.send('Hello from client!');
            updateStatus('Connected');
        };

        // Event listener for incoming messages from the server
        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            displayMessage('Server: ' + event.data);
        };

        // Event listener for when the connection is closed
        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
            updateStatus('Disconnected');
            // Optional: Attempt to reconnect after a delay
            if (event.wasClean) {
                console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                // e.g. server process killed or network down
                console.error('Connection died unexpectedly. Attempting to reconnect...');
                setTimeout(connectWebSocket, 3000); // Try to reconnect after 3 seconds
            }
        };

        // Event listener for errors
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            updateStatus('Error');
        };
    }

    // Function to send a message (e.g., from an input field)
    function sendMessage(message) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
            displayMessage('Client: ' + message);
        } else {
            console.warn('WebSocket is not open. Cannot send message.');
            displayMessage('Error: Not connected to server.');
        }
    }

    // --- Basic UI elements for demonstration ---
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesDiv = document.getElementById('messages');
    const statusSpan = document.getElementById('status');
    const connectButton = document.getElementById('connectButton');

    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const message = messageInput.value;
            if (message) {
                sendMessage(message);
                messageInput.value = ''; // Clear input
            }
        });
    }

    if (connectButton) {
        connectButton.addEventListener('click', connectWebSocket);
    }

    function displayMessage(msg) {
        const p = document.createElement('p');
        p.textContent = msg;
        messagesDiv.appendChild(p);
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
    }

    function updateStatus(status) {
        statusSpan.textContent = status;
        statusSpan.className = ''; // Clear previous classes
        if (status === 'Connected') {
            statusSpan.classList.add('connected');
        } else if (status === 'Disconnected' || status === 'Error') {
            statusSpan.classList.add('disconnected');
        }
    }

    // Initial connection attempt when the page loads
    connectWebSocket();

    // --- WebSocket Code Ends Here ---

});

const contactOpen=document.querySelector('.contact-open');
const contactInfo=document.querySelector('.contact-info');
const themeToggle=document.querySelector('.theme-toggle');
const addForm= document.querySelector('.add-form');
const formOpen=document.querySelector('.add-open');
const textArea=document.querySelector('.text-area');
const cancelButton=document.querySelector('.cancel-list');
const addButton=document.querySelector('.add-list');
const listHolder=document.querySelector('.list-holder');
const errorLogBox=document.querySelector('.error-log');

let objData={};
function saveToLocalStorage(){
    localStorage.setItem('list-saved', JSON.stringify(objData,null,4));
}

// 
contactOpen.onclick=()=>{
     contactInfo.classList.toggle('active');
    if(addForm.classList.contains('form-active')){
       addForm.classList.remove('form-active')
    }
}
// 
formOpen.onclick=()=>{
    addForm.classList.toggle('form-active');
    if(addForm.classList.contains('form-active')){
         textArea.focus()
    }
    if(contactInfo.classList.contains('active')){
        contactInfo.classList.remove('active')
    }
   
}

cancelButton.addEventListener('click', ()=>{
    textArea.value='';
     addForm.classList.remove('form-active');
     textArea.blur();
})
// 
themeToggle.addEventListener('click', ()=>{
    document.body.classList.toggle('dark-theme');
   if(document.body.classList.contains('dark-theme')){
     objData.isDarkThemeApplied=true;
   }
   else{
     objData.isDarkThemeApplied=false
   }
    saveToLocalStorage()
})
// 
window.addEventListener('load', ()=>{
   try{
     objData=JSON.parse(localStorage.getItem('list-saved'));
     if(objData===null){
       objData={
        isDarkThemeApplied:false,
        savedData:[]
       }
     }
   }catch(err){
    console.log(err)
   }
   if(objData.isDarkThemeApplied){
document.body.classList.add('dark-theme');
   }

   if(objData.savedData==null){
    return;
   }
   else{
    objData.savedData.forEach((element, index, array)=>{
const li=document.createElement('li');
const removeButton=document.createElement('button');
removeButton.classList.add('remove');
const compeletedButton=document.createElement('button');
compeletedButton.classList.add('done')

li.textContent=element.text;
if(element.compeleted){
    li.classList.add(('compeleted'))
}
li.appendChild(removeButton);
li.appendChild(compeletedButton);
listHolder.appendChild(li);
removeButton.addEventListener('click',function(){
    li.style.transform='translateX(100%) translateY(-30px)';
    li.addEventListener('transitionend', ()=>{
        li.remove()
    })
   let textTarget=this.parentElement.textContent;
   for(let i=0; i<objData.savedData.length; i++){
    if(textTarget===objData.savedData[i].text){
        objData.savedData.splice(i,1);
        errorLogBox.textContent='List removed.';
        errorLogBox.style.left='15%';
        setTimeout(()=>{
            errorLogBox.style.left='-300%';
        },2500)
    }
   }
    saveToLocalStorage()
})

compeletedButton.addEventListener('click',function(){
    this.parentElement.classList.add('compeleted')
    let textTarget=this.parentElement.textContent;
   for(let i=0; i<objData.savedData.length; i++){
    if(textTarget===objData.savedData[i].text){
       objData.savedData[i].compeleted=true;
       saveToLocalStorage();
       errorLogBox.innerHTML='GOOD JOB!<br> To do completed!';
        errorLogBox.style.left='15%';
        setTimeout(()=>{
            errorLogBox.style.left='-300%';
        },2500)
    }
   }
    
})
    });

   }
})
// 
function addAndAppendList(){
const li =document.createElement('li');
const removeButton=document.createElement('button');
const compeletedButton=document.createElement('button');
li.textContent=textArea.value;
removeButton.classList.add('remove');
compeletedButton.classList.add('done');

li.appendChild(removeButton);
li.appendChild(compeletedButton);
listHolder.appendChild(li);

const dataCollected={};
dataCollected.text=textArea.value;
dataCollected.completed=false;
objData.savedData.push(dataCollected)
removeButton.addEventListener('click',function(){
    li.style.transform='translateX(100%) translateY(-30px)';
    li.addEventListener('transitionend', ()=>{
        li.remove()
    })
   let textTarget=this.parentElement.textContent;
   for(let i=0; i<objData.savedData.length; i++){
    if(textTarget===objData.savedData[i].text){
        objData.savedData.splice(i,1);
          saveToLocalStorage()
           errorLogBox.textContent='List removed.';
        errorLogBox.style.left='15%';
        setTimeout(()=>{
            errorLogBox.style.left='-300%';
        },2500)
    }
   }
})

compeletedButton.addEventListener('click',function(){
    this.parentElement.classList.add('compeleted')
    let textTarget=this.parentElement.textContent;
    console.log(textTarget)
   for(let i=0; i<objData.savedData.length; i++){
    if(textTarget===objData.savedData[i].text){
        objData.savedData[i].compeleted=true;
       console.log(objData.savedData[i].textContent);
       saveToLocalStorage();
       errorLogBox.innerHTML='GOOD JOB!<br> To do completed!';
        errorLogBox.style.left='15%';
        setTimeout(()=>{
            errorLogBox.style.left='-300%';
        },2500)
    }
   }
})
saveToLocalStorage()
}

addButton.addEventListener('click', ()=>{
    
    if(textArea.value.trim().length==0){
        errorLogBox.textContent='Please type your to do first.';
        errorLogBox.style.left='15%';
        setTimeout(()=>{
             errorLogBox.style.left='-300%';
        },2500)
        return
    }
   let listExist= objData.savedData.some(element=>element.text==textArea.value);
    if(listExist){
        errorLogBox.textContent='This list exist';
        errorLogBox.style.left='15%';
        setTimeout(()=>{
            errorLogBox.style.left='-300%';
        },2500)
        return
    }
    addAndAppendList();
    textArea.blur();
    textArea.value='';
    addForm.classList.remove('form-active');
     errorLogBox.textContent='List added.';
        errorLogBox.style.left='15%';
        setTimeout(()=>{
             errorLogBox.style.left='-300%';
        },2500)
})
