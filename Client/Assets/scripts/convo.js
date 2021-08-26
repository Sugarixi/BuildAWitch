//code was taken from https://codepen.io/ashimiro/pen/Lkzqo and edited to my needs

//container - the html element where text will be displayed
//arrayOfText - the text that will be displayed
//timeoutsRefs - array that will hold all timeouts of the letters so we can clear it if user change page
function setConvTextWithRef(container, arrayOfText, timeoutsRefs) {
    $(container).text("");
    var dialogs = arrayOfText,  
        initial = 0;
        individual = dialogs[initial].split('');

    function createDiag ( dialog ) {
        for(i = 0; i < dialog.length; i++) {
            (function(i){       
                timeoutsRefs.push(setTimeout(function(){
                    $(container).text($(container).text() +   dialog[i]);
                }, 50*i));    
            }(i));
        }
    }

    createDiag( individual );
}

//same as above without timeouts ref
function setConvText(container, arrayOfText) {
    $(container).text("");
    var dialogs = arrayOfText,  
        initial = 0;
        individual = dialogs[initial].split('');

    function createDiag ( dialog ) {
        for(i = 0; i < dialog.length; i++) {
            (function(i){       
                setTimeout(function(){
                    $(container).text($(container).text() +   dialog[i]);
                }, 50*i);    
            }(i));
        }
    }

    createDiag( individual );
}