document.addEventListener('DOMContentLoaded', function(){
    let messageElem = document.querySelector('.error');
    let messageElemTwo = document.querySelector('.created');
    if (messageElem.innerHTML !== '' || messageElemTwo !== ''){
        setTimeout(function(){
            messageElem.innerHTML = '';
            messageElemTwo.innerHTML = '';
        }, 5000);
    }

});