let potionScore;
let speed;
let speedChange = false;
let minimumSpeed = 0.7;
let isAlive;
let incScore;

function initPotion() {
    potionScore = 0;
    $(".potionScoreValue").html(potionScore);
    speed = 2;
    $("#potion").css("animation-duration", "2s");
    speedChange = false;
    minimumSpeed = 0.7;
    document.getElementById("potion").classList.remove("animatePotion");;

    if (isAlive) {
        clearInterval(isAlive);
    }
    if (incScore) {
        clearInterval(incScore);
    }
}

function startPotions() {
    $("#restartPotion").css("display", "none");
    const witch = $(".witch")[0];
    const potion =  document.getElementById("potion");

    let potionScore = 0;

    speed = $("#potion").css("animation-duration").replace("s","");
    let speedChange = false;
    let minimumSpeed = 0.7;

    function jump() {
        if (witch.classList != "jump"){

            witch.classList.add("jump");
            setTimeout(function(){
                witch.classList.remove("jump");
            }, 500)
        }
    }

    isAlive = setInterval(function(){
            //Get current witch Y position
        let witchTop = parseInt(window.getComputedStyle(witch).getPropertyValue("top"));
            //Get current potion X position
        let potionLeft = parseInt(window.getComputedStyle(potion).getPropertyValue("left"));

            //Detect collision
        if(potionLeft < 40 && potionLeft > 0 && witchTop >= 90)
        {
            showGameOver("potionScreen");
            UpdatePoints(potionScore);
            $(".endScreenText").html("Congratulations! <br> You jumped over some potions earning " + potionScore + " points!");
            initPotion();
            $("#restartPotion").css("display", "");
        }
    }, 10)

    incScore = setInterval(function() {
        $(".potionScoreValue").html(++potionScore);
        speedChange = true;
    }, 1000);

    function updateSpeed() {
        speed = speed - 0.1;
        if (speed < minimumSpeed)
            speed = minimumSpeed;
        $("#potion").css("animation-duration", speed + "s");
        speedChange = false;
    }

    $(document).on("keydown click", function(event){
        jump();
    });

    potion.classList.add("animatePotion");
    potion.addEventListener("animationend", function (e) {
        potion.classList.remove("animatePotion");
        let randomNum = (Math.floor(Math.random() * 4) + 1); //1-4
        $("#potion").css("background-image", "url(../Potion Game/potion" + randomNum + ".png) !important");
        if (speedChange) {
            updateSpeed();
        }
        void this.offsetWidth; //hack
        potion.classList.add("animatePotion");
    });
}