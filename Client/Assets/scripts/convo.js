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