/* 
Parameters and fields 
*/

let UISelectors = {
  inputName: '#name',
  inputEmail: '#email',
  inputMessage: '#message',
  btnSubmit: '#submit'
}

let UIElements = {
  elementInputName: document.querySelector(UISelectors.inputName),
  elementInputEmail: document.querySelector(UISelectors.inputEmail),
  elementInputMessage: document.querySelector(UISelectors.inputMessage),
  elementBtnSubmit: document.querySelector(UISelectors.btnSubmit)
}

document.addEventListener('DOMContentLoaded', (e)=>{
  // prevent the default behavior 
  e.preventDefault();

  // load all Event listeners 
  loadingEventListener();
})

let loadingEventListener = ()=>{
  // Event Listener for submit form 
  document.querySelector('form').addEventListener('submit', submitForm);
}

// validate form event listener 
let submitForm = function(e){

  // prevent the default behaviour 
  e.preventDefault();

  // get the values of the input fields 
  let name= UIElements.elementInputName; 
  let email = UIElements.elementInputEmail;
  let message = UIElements.elementInputMessage;

  let data = {
    fullname: name.value,
    email: email.value,
    message: message.value
  }

  // validate the input fields 
  let isErrorName = validateCheckEmpty(name.value, name.id);
  let isErrorMessage = validateCheckEmpty(message.value, message.id);
  let isErrorEmail = validateEMail(email.value, email.id);

  // check for error on second input and dismiss the error messages if there are any 
  if(isErrorName.error == null){
    dismissError(isErrorName)
  }else{
    displayError(isErrorName)
  }

  // check for error on second input and dismiss the error messages if there are any 
  if(isErrorMessage.error == null){
    dismissError(isErrorMessage)
  }else{
    displayError(isErrorMessage)
  }

  // check for error on second input and dismiss the error messages if there are any 
  if(isErrorEmail.error == null){
    dismissError(isErrorEmail)
  }else{
    displayError(isErrorEmail)
  }

  // unlock the submit button if there are no errors
  if(isErrorEmail.error == null && isErrorMessage.error == null && isErrorName.error == null){
    // submit the form 
   postData('/message', data)
  .then(data =>  { console.log(JSON.stringify(data))} ) // JSON-string from `response.json()` call
  .catch(error => console.error(error));
  }

}

// validation email -> return value either 0 for okay or 1 for error 
let validateEMail = function(email, elementId){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()) ? {error: null, elem: elementId} : {error: 2, elem: elementId};
}

// validation input text check empty -> return value either 0 for okay or 1 for error ( empty )
let validateCheckEmpty = function(inputText,elementId){
  if(inputText == '' || inputText == null){
    return {error: 1, elem: elementId}
  }else{
    return {error: null,  elem: elementId}
  }
}

// display an error if the is a invalid inout field 
let displayError = function(error){
  let divContainer = document.createElement('div');
  divContainer.className = `alert alert-danger error-${error.elem}`;
  let textNode;
  switch(error.error){
    case 1:
      textNode = document.createTextNode(`${error.elem} cannot be empty`)
      break;
    case 2:
      textNode = document.createTextNode(`${error.elem} is not a valid email field`);
      break;
  }
  // append the error text into the alert danerg container 
  divContainer.appendChild(textNode);
  
  // append the error mesage after the div if the error message does not exists 
  if(document.querySelector(`.error-${error.elem}`) === null){
    document.querySelector(`#${error.elem}`).parentElement.append(divContainer);
  }
  
}

// dismiss an error if the field is valid on second or more tries 
let dismissError = function(error){
  let errorElem = document.querySelector(`.error-${error.elem}`);
  if(errorElem){
    errorElem.remove();
  }
}

function postData(url = '', data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then((data)=> displaySuccessMessageOrError(data)); // parses JSON response into native JavaScript objects 
}

// display an success or error message 
function displaySuccessMessageOrError(resposeobject){
  if(!resposeobject.error){
    displayMessage('#contact', 0, 'Email has successfully been send, we will call you as soon as possible.')
  }else{
    displayMessage('#contact', 1, 'Email could not be send. We will fix it as soon as possible.')
  }
}

// messagetype 0 is success 
// messagetype 1 is error 
function displayMessage(elementIdOrClassname,messagetype,message){
  let divContainer = document.createElement('div');
  let textNode;
  switch(messagetype){
    case 0:
        divContainer.className = `alert alert-success message-${messagetype}`;
        break;
    case 1:
        divContainer.className = `alert alert-danger message-${messagetype}`;
        break;
  }
  textNode = document.createTextNode(`${message}`)
  divContainer.appendChild(textNode);
  let form = document.querySelector('form')
  form.parentElement.insertBefore(divContainer,form);

  setTimeout(()=>{
    // remove the message 
    document.querySelector(`.message-${messagetype}`).remove();
    // clear the fields 
    UIElements.elementInputEmail.value = "";
    UIElements.elementInputMessage.value = "";
    UIElements.elementInputName.value = "";
  }, 5000);
}

