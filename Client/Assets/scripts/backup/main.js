let activeContent = "mainContent";

function gotoPage(contentContainer, gameName) {
    initBubbles();
    initPotion();
    $("." + activeContent).css("display","none");
    $("." + contentContainer).css("display","block");
    activeContent = contentContainer;

    if (gameName == "bubbles") {
        startBubbles();
    }
    else if (gameName == "potionGame") {
        startPotions();
    }

    window.location.href = "#";
}

function showGameOver(gameClassName) {
    $(".gameOver").css("display", "flex");
    $(".gameEndScreen ").css("display", "none");
    $("." + gameClassName).css("display", "flex");
}

function hideGameOver() {
    $(".gameOver").css("display", "none");
    $(".gameEndScreen ").css("display", "none");
}

function hidePreGame() {
    $(".preGame").css("display", "none");
}

function randomAnimations() {
    let mainChar = $(".mainCharacter")[0];
    mainChar.classList.remove("swing");
    mainChar.classList.remove("bounce");

    let rnd = Math.floor(Math.random() * 3 + 1);

    if (rnd == 1) {
        mainChar.classList.add("bounce");
    }
    else if (rnd == 2) {
        mainChar.classList.add("swing");
    }
    else {
        //do nothing
    }
    
}
function initRandomAnimations() {
    randomAnimations();
    let randomCharAnimation = setInterval(function() {
        randomAnimations();
    }, 4000);
}

function randomConv() {
    let convs = [ 
        ['Hello there!'],
        ['How are you doing today?'],
    ];

    let rnd = Math.floor(Math.random() * convs.length);
    setConvText(convs[rnd]);
}
function initRandomConv() {
    randomConv();
    let randomCharConv = setInterval(function() {
        randomConv();
    }, 10000);
}

$( document ).ready(function() {
    initRandomConv();
    initRandomAnimations();

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("envelope");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
