

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/To-Do/sw.js')
    .then(() => console.log('Service Worker registered!'))
    .catch(err => console.error('Service Worker error:', err));
}
window.addEventListener('load', () => {
  document.getElementById('splash-screen').style.display = 'none';
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
        errorLogBox.textContent='Task removed.';
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
       errorLogBox.innerHTML='GOOD JOB!<br>Task completed!';
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
           errorLogBox.textContent='Task removed.';
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
       errorLogBox.innerHTML='GOOD JOB!<br>Task completed!';
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
        errorLogBox.textContent='Please type your task first.';
        errorLogBox.style.left='15%';
        setTimeout(()=>{
             errorLogBox.style.left='-300%';
        },2500)
        return
    }
   let listExist= objData.savedData.some(element=>element.text==textArea.value);
    if(listExist){
        errorLogBox.textContent='This task already exist';
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
     errorLogBox.textContent='Task added.';
        errorLogBox.style.left='15%';
        setTimeout(()=>{
             errorLogBox.style.left='-300%';
        },2500)
})
