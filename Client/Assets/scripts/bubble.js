let bubbleCount = 0; //used in the generation of a unique class name per bubble
let bubbleScore = 0; //holds the current player score
let timer = 20;
let bubbleGenerator; //holds the interval reference of the bubble generator
let timerInterval; //holds the interval reference of the timer
    
//initializing the game (reset game values and old intervals if exists)
function initBubbles() {
    bubbleCount = 0;
    bubbleScore = 0;
    score = 0;
    timer = 20;
    $(".bubbleScoreValue").html("0");
    $(".timerValue").html(timer);
    $(".bubbleEntity").remove();

    if (bubbleGenerator) {
        clearInterval(bubbleGenerator);
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

//update score ui
function updateScore() {
    $(".bubbleScoreValue").html(++bubbleScore);
}

//update timer ui
function updateTimer() {
    $(".timerValue").html(--timer);
}

//starts the game
function startBubbles(shouldInit) { 
    //hiding restart button
    $("#restartbubbles").css("display", "none");

    //in case user clicked on restart button - initiate the game
    if (shouldInit)
        initBubbles();
        
    //get cauldron html element
    let cauldron = $(".cauldronTop");
    function createBubble() {
        //generating unique bubble class name so we can handle each bubble seperately COMPLETE LINE NUMBER HERE
        var bubbleClassName = "bubble" + bubbleCount;
        //add a new bubble to html with unique class name
        $(".container").append('<div class="bubbleEntity animate ' + bubbleClassName + '"></div>');
        
        //calculating min/max bubble position based on cauldron's width and position on the screen
        let cauldronWidth = cauldron.width();
        let minPos = cauldron.position().left + (cauldronWidth*0.15); //calculate minimum left position we can create a bubble plus 15% of the width so the bubble wont be generated in the transparent area on the left side of the cauldron image
        let maxPos = minPos + cauldron.width() - (cauldronWidth*0.4); //calculate maximum left position (right) we can create a bubble minus 40% of the width so the bubble wont be generated in the transparent area on the right side of the cauldron image

        //randomizing the bubble position based on previous calcs
        let bubblePos = Math.random() * (maxPos - minPos + 1) + minPos;
        $("." + bubbleClassName).css("left", bubblePos + "px");

        //whenever a bubble reach top of div - remove it from html to not run out of memory
        $("." + bubbleClassName).one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
            $(this).remove();
        });

        //whenever user clicks on a bubble - pop it and update score
        $("." + bubbleClassName).on("click", function() {
            $(this).remove();
            updateScore();
        });
        bubbleCount++;
    }

    //interval handling bubble creation
    bubbleGenerator = setInterval(function() {
        createBubble();
    }, 350);

    //interval handling timer
    timerInterval = setInterval(function() {
        updateTimer();
        if (timer === 0) { //when game timer runs out

            //clearing intervals so the game wont continue running at the background
            clearInterval(timerInterval);
            clearInterval(bubbleGenerator);

            //removing all existing bubbles
            $(".animate").remove();
            showGameOver("bubbleScreen"); //shows endscreen
            UpdatePoints(bubbleScore); //update points in the database

            //display the endscreen text with the score earned by the player
            $(".endScreenText").html("Congratulations! <br> You popped " + bubbleScore + " bubbles earning " + bubbleScore + " points!");

            //hiding restart button
            $("#restartbubbles").css("display", "");
        }
    }, 1000);
}