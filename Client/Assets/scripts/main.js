let activeContent = "mainContent";
let timeoutsArray = [];
function gotoPage(contentContainer, gameName) {
    initBubbles();
    initPotion();
    $("." + activeContent).css("display","none");
    $("." + contentContainer).css("display","block");
    activeContent = contentContainer;

    if (gameName == "bubbles") {
        showInstructions("Let's make some potions! Pop as many bubbles as you can within the time limit. Good luck!");
        functionToStart = startBubbles;
    }
    else if (gameName == "potionGame") {
        showInstructions("Hurry up and run, the class is starting soon! Please avoid breaking any potions on your way there! Good luck!");
        functionToStart = startPotions;
    }

    window.location.href = "#";
}

function showInstructions(text) {
    let arrLetters = [text];
    clearTimeoutsArray();
    $(".preGame").css("display", "");
    setConvTextWithRef(".instructionsText", arrLetters, timeoutsArray);
}

function clearTimeoutsArray() {
    timeoutsArray.forEach(function(e) {
        clearTimeout(e);
    });
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
    functionToStart();
    functionToStart = undefined;
}

function randomAnimations() {
    let mainChar = $(".mainCharacter")[0];
    if (mainChar) {
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
    } else {
        //some weird error with animations, need to reload main
        console.log("weird error");
        $('#appContainer').load('/views/main.html');
    }
    
}
function initRandomAnimations() {
    randomAnimations();
    randomCharAnimation = setInterval(function() {
        randomAnimations();
    }, 4000);
}

function randomConv() {
    let convs = [ 
        ['Hello there!'],
        ['How are you doing today?'],
    ];

    let rnd = Math.floor(Math.random() * convs.length);
    setConvText(".convoText", convs[rnd]);
}
function initRandomConv() {
    randomConv();
    randomCharConv = setInterval(function() {
        randomConv();
    }, 10000);
}

function LoadMain() {
    initRandomConv();
    initRandomAnimations();
    initCloset();
    gotoPage("mainContent");

    let setId = window.loggedUser.equippedSet ? window.loggedUser.equippedSet+1 : 1;
    $(".mainCharacter")[0].src = "Assets/images/character" + setId + ".png";
    $(".pointsContainer").html(window.loggedUser.points);

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
};

function logout() {
    window.loggedUser = undefined;
    clearInterval(randomCharAnimation);
    clearInterval(randomCharConv);
    $("#restartbubbles").css("display", "none");
    $("#restartPotion").css("display", "none");
    $('#loginContainer')[0].classList.add("animateWushView");
    $('#appContainer')[0].classList.add("animateWushBot");
    $('#loginContainer').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
        $(this).css("margin-top", "0vh");
        $(this)[0].classList.remove("animateWushView");
    });

    $('#appContainer').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
        $(this).css("margin-top", "100vh");
        $(this)[0].classList.remove("animateWushBot");
        $(this).empty();
    });
}

function UpdatePoints(points) {
    var oldPoints = points;
    window.loggedUser.points += points;
    fetch("/UpdatePoints", {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(window.loggedUser)
    }).then(function(res) {
        if (res.status == 200)
            $(".pointsContainer").html(window.loggedUser.points);
        else {
            window.loggedUser.points = oldPoints;
            alert("NOOOOO KAPARA");
        }
    });
}