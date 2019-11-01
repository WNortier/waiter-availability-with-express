document.addEventListener('DOMContentLoaded', function(){
    let messageElem = document.querySelector('.error');
    if (messageElem.innerHTML !== ''){
        setTimeout(function(){
            messageElem.innerHTML = '';
        }, 5000);
    }

});