let activeContent = "mainContent"; //holds the current active page in the app
let timeoutsArray = []; //holds all the timeouts of the conversation letters so we can clear and remove them when user change page

//navigate to a page
//contentContainer - the new page user want to navigate to
//gameName - the game name user want to play
function gotoPage(contentContainer, gameName) {
    initBubbles(); //initialize the bubble game - resetting all values and intervals
    initPotion(); //initialize the potion game - resetting all values and intervals
    $("." + activeContent).css("display","none"); //hide the current active page
    $("." + contentContainer).css("display","block"); //display the new page user navigated to
    activeContent = contentContainer;

    //display instructions based on the game the user want to play
    if (gameName == "bubbles") {
        showInstructions("Let's make some potions! Pop as many bubbles as you can within the time limit. Good luck!");
        functionToStart = startBubbles; //set which function to run once instructions popup is closed
    }
    else if (gameName == "potionGame") {
        showInstructions("Hurry up and run, the class is starting soon! Please avoid breaking any potions on your way there! Good luck!");
        functionToStart = startPotions; //set which function to run once instructions popup is closed
    }
}

//function to show the instructions of a game
//text - the text to display in the instructions
function showInstructions(text) {
    let arrLetters = [text]; //array of letters to be displayed based on the text
    clearTimeoutsArray(); //clear all the timeouts from any ongoing conversation
    $(".preGame").css("display", ""); //display the pregame popup by removing the "display: none;" css attribute
    setConvTextWithRef(".instructionsText", arrLetters, timeoutsArray); //starts the conversation
}

//clear all the timeouts from any ongoing conversation
function clearTimeoutsArray() {
    timeoutsArray.forEach(function(e) {
        clearTimeout(e);
    });
}

//display the gameover popup
function showGameOver(gameClassName) {
    $(".gameOver").css("display", "flex");

    //hide both end screen of both games then display only the relevant one
    $(".gameEndScreen ").css("display", "none");
    $("." + gameClassName).css("display", "flex");
}

//hide the gameover popup
function hideGameOver() {
    $(".gameOver").css("display", "none");
    $(".gameEndScreen ").css("display", "none");
}

//hide instructions popup and start the chosen game
function hidePreGame() {
    $(".preGame").css("display", "none");
    functionToStart(); //run the function based on the game user want to play (startBubbles / startPotions)
}

//randomize main screen conversation text
function randomAnimations() {
    let mainChar = $(".mainCharacter")[0]; //get main character html element
    if (mainChar) { //checking if the main chracter exist, otherwise that means we hit a weird error i do not know how to fix
        
        //remove all animations of the main chracter
        mainChar.classList.remove("swing");
        mainChar.classList.remove("bounce");

        //randomize a number between 1 to 3
        let rnd = Math.floor(Math.random() * 3 + 1);

        //set character animation based on the generated random number
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

//initiate the random animation interval, every 4 seconds set a new animation for the main character
function initRandomAnimations() {
    randomAnimations();
    randomCharAnimation = setInterval(function() {
        randomAnimations();
    }, 4000);
}

//randomize a conversation for main character and display it
function randomConv() {
    let convs = [ 
        ['Hello there!'],
        ['How are you doing today?'],
        ['Hey!'],
    ];

    //randomize a number between 0 to amount of defined conversations (3) and set it to be the active conversation
    let rnd = Math.floor(Math.random() * convs.length);
    setConvText(".convoText", convs[rnd]);
}

//initiate the random conversation interval, every 10 seconds set a new conversation for the main character
function initRandomConv() {
    randomConv();
    randomCharConv = setInterval(function() {
        randomConv();
    }, 10000);
}

//loading the app content after login
function LoadMain() {
    initRandomConv(); //initiate the main chracter conversation
    initRandomAnimations(); //initiate the main character animation
    initCloset(); //initiate the closet
    gotoPage("mainContent"); //navigate to the main tab

    let setId;
    //if the user has an equipped set - initiate it
    if (window.loggedUser.equippedSet)
        setId = window.loggedUser.equippedSet+1
    else //otherwise set it to 1 (student)
        setId = 1;
    
    //set the main character image (set) based on the current equipped set of the user (character1, chracter2, ...)
    $(".mainCharacter")[0].src = "Assets/images/character" + setId + ".png";

    //set the points of the user in the ui
    $(".pointsContainer").html(window.loggedUser.points);

    // Get the contact-us modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the contact-us modal
    var btn = document.getElementById("envelope");

    // Get the <span> element (x) that closes the contact-us modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the contact-us modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the contact-us modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the contact-us modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};

//logging out the user and clear any intervals and values
function logout() {
    window.loggedUser = undefined; //reset the logged user
    clearInterval(randomCharAnimation); //remove the main character animation interval
    clearInterval(randomCharConv); //remove the main character conversation interval

    //remove any restart buttons
    $("#restartbubbles").css("display", "none");
    $("#restartPotion").css("display", "none");

    //animate login page back to screen and the app off screen
    $('#loginContainer')[0].classList.add("animateWushView");
    $('#appContainer')[0].classList.add("animateWushBot");

    //keep animation margin-top value after the animation ends
    $('#loginContainer').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
        $(this).css("margin-top", "0vh");
        $(this)[0].classList.remove("animateWushView");
    });
    $('#appContainer').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
        $(this).css("margin-top", "100vh");
        $(this)[0].classList.remove("animateWushBot");

        //empty the app div to not cause overload and to prevent trickery users can do with F12
        $(this).empty();
    });
}

//update points in the database. this function is defined here so both bubble.js and potion.js can access it
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
        if (res.status == 200) //if succeeded - set the ui points to be the new points of the user
            $(".pointsContainer").html(window.loggedUser.points);
        else {
            window.loggedUser.points = oldPoints; //revert to the old points the user had
            alert("Updating points failed");
        }
    });
}