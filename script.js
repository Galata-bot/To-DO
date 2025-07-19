document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed.');

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    } else {
        console.warn('Service Workers are not supported in this browser.');
    }

    const socketUrl = 'ws://localhost:8080'; 

    let socket; 

    function connectWebSocket() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('WebSocket is already open.');
            return;
        }

        socket = new WebSocket(socketUrl);

        socket.onopen = (event) => {
            console.log('WebSocket connection established:', event);
            socket.send('Hello from client!');
            updateStatus('Connected');
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            displayMessage('Server: ' + event.data);
        };

        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
            updateStatus('Disconnected');
            if (event.wasClean) {
                console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                console.error('Connection died unexpectedly. Attempting to reconnect...');
                setTimeout(connectWebSocket, 3000);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            updateStatus('Error');
        };
    }

    function sendMessage(message) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
            displayMessage('Client: ' + message);
        } else {
            console.warn('WebSocket is not open. Cannot send message.');
            displayMessage('Error: Not connected to server.');
        }
    }

    // Get references to UI elements. These might be null if not in HTML.
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesDiv = document.getElementById('messages');
    const statusSpan = document.getElementById('status');
    const connectButton = document.getElementById('connectButton');

    // Only add event listeners if the elements exist
    if (sendButton) {
        sendButton.addEventListener('click', () => {
            const message = messageInput.value;
            if (message) {
                sendMessage(message);
                messageInput.value = '';
            }
        });
    }

    if (connectButton) {
        connectButton.addEventListener('click', connectWebSocket);
    }

    function displayMessage(msg) {
        // Only display message if messagesDiv exists
        if (messagesDiv) {
            const p = document.createElement('p');
            p.textContent = msg;
            messagesDiv.appendChild(p);
            messagesDiv.scrollTop = messagesDiv.scrollHeight; 
        } else {
            console.log('Message (UI not found): ' + msg); // Log to console if UI element is missing
        }
    }

    function updateStatus(status) {
        // Only update status if statusSpan exists
        if (statusSpan) {
            statusSpan.textContent = status;
            statusSpan.className = '';
            if (status === 'Connected') {
                statusSpan.classList.add('connected');
            } else if (status === 'Disconnected' || status === 'Error') {
                statusSpan.classList.add('disconnected');
            }
        } else {
            console.log('Status (UI not found): ' + status); // Log to console if UI element is missing
        }
    }

    connectWebSocket();

    // To-Do List UI elements - also made robust
    const contactOpen=document.querySelector('.contact-open');
    const contactInfo=document.querySelector('.contact-info');
    const themeToggle=document.querySelector('.theme-toggle');
    const addForm= document.querySelector('.add-form');
    const formOpen=document.querySelector('.add-open');
    const textArea=document.querySelector('.text-area');
    const cancelButton=document.querySelector('.cancel-list');
    const addButton=document.querySelector('.add-list');
    const listHolder=document.querySelector('.list-holder');
    const errorLogBox=document.querySelector('.error-log'); // Made robust below

    let objData={};
    function saveToLocalStorage(){
        localStorage.setItem('list-saved', JSON.stringify(objData,null,4));
    }

    if (contactOpen) {
        contactOpen.onclick=()=>{
            if (contactInfo) contactInfo.classList.toggle('active');
            if(addForm && addForm.classList.contains('form-active')){
                addForm.classList.remove('form-active')
            }
        }
    }

    if (formOpen) {
        formOpen.onclick=()=>{
            if (addForm) addForm.classList.toggle('form-active');
            if(addForm && addForm.classList.contains('form-active')){
                if (textArea) textArea.focus()
            }
            if(contactInfo && contactInfo.classList.contains('active')){
                contactInfo.classList.remove('active')
            }
            
        }
    }

    if (cancelButton && textArea && addForm) {
        cancelButton.addEventListener('click', ()=>{
            textArea.value='';
            addForm.classList.remove('form-active');
            textArea.blur();
        })
    }

    if (themeToggle) {
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
    }

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
                if (listHolder) listHolder.appendChild(li); // Made robust
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
                            if (errorLogBox) { // Made robust
                                errorLogBox.textContent='List removed.';
                                errorLogBox.style.left='15%';
                                setTimeout(()=>{
                                    errorLogBox.style.left='-300%';
                                },2500)
                            }
                        }
                    }
                })

                compeletedButton.addEventListener('click',function(){
                    this.parentElement.classList.add('compeleted')
                    let textTarget=this.parentElement.textContent;
                    for(let i=0; i<objData.savedData.length; i++){
                        if(textTarget===objData.savedData[i].text){
                            objData.savedData[i].compeleted=true;
                            saveToLocalStorage();
                            if (errorLogBox) { // Made robust
                                errorLogBox.innerHTML='GOOD JOB!<br> To do completed!';
                                errorLogBox.style.left='15%';
                                setTimeout(()=>{
                                    errorLogBox.style.left='-300%';
                                },2500)
                            }
                        }
                    }
                })
            });
        }
    })

    function addAndAppendList(){
        const li =document.createElement('li');
        const removeButton=document.createElement('button');
        const compeletedButton=document.createElement('button');
        if (textArea) li.textContent=textArea.value; // Made robust
        removeButton.classList.add('remove');
        compeletedButton.classList.add('done');

        li.appendChild(removeButton);
        li.appendChild(compeletedButton);
        if (listHolder) listHolder.appendChild(li); // Made robust

        const dataCollected={};
        if (textArea) dataCollected.text=textArea.value; // Made robust
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
                    if (errorLogBox) { // Made robust
                        errorLogBox.textContent='List removed.';
                        errorLogBox.style.left='15%';
                        setTimeout(()=>{
                            errorLogBox.style.left='-300%';
                        },2500)
                    }
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
                    if (errorLogBox) { // Made robust
                        errorLogBox.innerHTML='GOOD JOB!<br> To do completed!';
                        errorLogBox.style.left='15%';
                        setTimeout(()=>{
                            errorLogBox.style.left='-300%';
                        },2500)
                    }
                }
            }
        })
        saveToLocalStorage()
    }

    if (addButton && textArea && addForm) {
        addButton.addEventListener('click', ()=>{
            if(textArea.value.trim().length==0){
                if (errorLogBox) { // Made robust
                    errorLogBox.textContent='Please type your to do first.';
                    errorLogBox.style.left='15%';
                    setTimeout(()=>{
                        errorLogBox.style.left='-300%';
                    },2500)
                }
                return
            }
            let listExist= objData.savedData.some(element=>element.text==textArea.value);
            if(listExist){
                if (errorLogBox) { // Made robust
                    errorLogBox.textContent='This list exist';
                    errorLogBox.style.left='15%';
                    setTimeout(()=>{
                        errorLogBox.style.left='-300%';
                    },2500)
                }
                return
            }
            addAndAppendList();
            textArea.blur();
            textArea.value='';
            addForm.classList.remove('form-active');
            if (errorLogBox) { // Made robust
                errorLogBox.textContent='List added.';
                errorLogBox.style.left='15%';
                setTimeout(()=>{
                    errorLogBox.style.left='-300%';
                },2500)
            }
        })
    }
});
