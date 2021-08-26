let potionScore; //holds the current player score
let speed; //holds the current speed of the potions
let speedChange = false; //a flag to know if speed was changed
let minimumSpeed = 0.7; //the minimum animation speed (fastest) the potions can have
let isAlive; //holds the interval that check if player is alive
let intScore; //holds the interval of the score

//initializing the game (reset game values and old intervals if exists)
function initPotion() {
    potionScore = 0;
    $(".potionScoreValue").html(potionScore);
    speed = 2;
    $("#potion").css("animation-duration", "2s");
    speedChange = false;
    minimumSpeed = 0.7;
    document.getElementById("potion").classList.remove("animatePotion"); //stop potion animation

    if (isAlive) {
        clearInterval(isAlive);
    }
    if (intScore) {
        clearInterval(intScore);
    }
}

//starts the game
function startPotions() {
    //hiding restart button
    $("#restartPotion").css("display", "none");

    //get player html element and potion html element
    const witch = $(".witch")[0];
    const potion =  document.getElementById("potion");

    let potionScore = 0; //reset score

    //get the current speed of the potion animation
    speed = $("#potion").css("animation-duration").replace("s","");
    let speedChange = false;

    //define the jump function
    function jump() {
        if (witch.classList != "jump"){ //if the player is not in a middle of a jump (avoid double-jumping)

            witch.classList.add("jump"); //add the jump class animation
            setTimeout(function(){
                witch.classList.remove("jump"); //remove the jumping animation after half a second
            }, 500)
        }
    }

    //interval to check if the player is alive or dead every 10 ms
    isAlive = setInterval(function(){
            //Get current player Y position
        let witchTop = parseInt(window.getComputedStyle(witch).getPropertyValue("top"));
            //Get current potion X position
        let potionLeft = parseInt(window.getComputedStyle(potion).getPropertyValue("left"));

            //Detect collision
            //player is found on left: 40 therefore if potion reach 40 to 0 - its in the player range
            //player position is top: 100 therefore if its found around 90 or above (lower on the screen, aka not jumping) - its in the potion range
            //if all the above apply - player collides with potion
        if(potionLeft < 40 && potionLeft > 0 && witchTop >= 90)
        {
            showGameOver("potionScreen"); //shows endscreen
            UpdatePoints(potionScore); //update points in the database

            //display the endscreen text with the score earned by the player
            $(".endScreenText").html("Congratulations! <br> You jumped over some potions earning " + potionScore + " points!");

            //initializing the game so it will not continue running at the background
            initPotion();
            $("#restartPotion").css("display", ""); //hiding restart button
        }
    }, 10)

    //every second increase the score and inform that next potion should be faster
    intScore = setInterval(function() {
        $(".potionScoreValue").html(++potionScore);
        speedChange = true;
    }, 1000);

    //updating potion speed animation
    function updateSpeed() {
        speed = speed - 0.1; //set speed animation to be 0,1 faster
        if (speed < minimumSpeed) //if the new speed value is lower than the minimum (0.7) we keep it as the minimum instead
            speed = minimumSpeed;
        $("#potion").css("animation-duration", speed + "s"); //update css animation-duration for the potion
        speedChange = false; //inform a speed change has been done and not needed again until next time
    }

    $(document).on("keydown click", function(event){
        jump();
    });

    //add the animation class to the potion
    potion.classList.add("animatePotion");

    //when potion animation ends
    potion.addEventListener("animationend", function (e) {
        potion.classList.remove("animatePotion"); //remove animation class
        let randomNum = (Math.floor(Math.random() * 4) + 1); //random a number between 1-4
        $("#potion").css("background-image", "url(../Assets/Images/potion" + randomNum + ".png)"); //change potion picture to be based on the random number (potion1, potion2....)
        if (speedChange) { //if there should be a speed change, execute it now
            updateSpeed();
        }
        void this.offsetWidth; //hack to make sure new image and new animation will be on the next potion
        potion.classList.add("animatePotion"); //add the new animation to the potion
    });
}