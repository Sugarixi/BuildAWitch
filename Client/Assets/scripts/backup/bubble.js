let bubbleCount = 0;
let bubbleScore = 0;
let timer = 20;
let bubbleGenerator;
let timerInterval;
    
function initBubbles() {
    bubbleCount = 0;
    bubbleScore = 0;
    score = 0;
    timer = 20;
    $(".bubbleScoreValue").html(bubbleScore);
    $(".timerValue").html(timer);
    $(".bubbleEntity").remove();

    if (bubbleGenerator) {
        clearInterval(bubbleGenerator);
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

function updateScore() {
    $(".bubbleScoreValue").html(++bubbleScore);
}

function updateTimer() {
    --timer;
    let timerString = timer < 10 ? "0"+timer : timer;
    $(".timerValue").html(timerString);
}

function startBubbles() { 
    //fetch image offset position
    let cauldron = $(".cauldronTop");
    function createBubble() {
        var bubbleClassName = "bubble" + bubbleCount;
        //add a new bubble
        $(".container").append('<div class="bubbleEntity animate ' + bubbleClassName + '"></div>');
        //randomize bubble position
        let cauldronWidth = cauldron.width();
        let minPos = cauldron.position().left + (cauldronWidth*0.15);
        let maxPos = minPos + cauldron.width() - (cauldronWidth*0.4);

        let bubblePos = Math.random() * (maxPos - minPos + 1) + minPos;
        $("." + bubbleClassName).css("left", bubblePos + "px");

        $("." + bubbleClassName).one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
            $(this).remove();
        });

        $("." + bubbleClassName).on("click", function() {
            $(this).remove();
            updateScore();
        });
        bubbleCount++;
    }

    bubbleGenerator = setInterval(function() {
        createBubble();
    }, 350);

    timerInterval = setInterval(function() {
        updateTimer();
        if (timer === 0) {
            clearInterval(timerInterval);
            clearInterval(bubbleGenerator);
            $(".animate").remove();
            showGameOver("bubbleScreen");
            $(".endScreenText").html("Congratulations! <br> You popped " + bubbleScore + " bubbles earning " + bubbleScore + " points!");
        }
    }, 1000);
}