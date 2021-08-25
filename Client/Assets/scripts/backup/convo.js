function setConvText(arrayOfText) {
    $('.convoText').text("");
    var dialogs = arrayOfText,  
        initial = 0;
        individual = dialogs[initial].split('');

    function createDiag ( dialog ) {
        for(i = 0; i < dialog.length; i++) {
            (function(i){       
                setTimeout(function(){
                    $('.convoText').text($('.convoText').text() +   dialog[i]);
                }, 50*i);              
            }(i));            
        }
    }

    createDiag( individual );
}