let starCount = 0; //used in the generation of a unique class name per star

function createStar() {
  //generating star classname based on amount of stars already exists so we can handle each star seperately (line 18)
  let starClassNames =
    "starCount" + starCount + " star" + (Math.floor(Math.random() * 2) + 1);

  //add a new star to the html
  $(".starsBackground").append('<div class="' + starClassNames + '"></div>');

  //randomize star position
  let minPos = 0;
  let maxPos = screen.width;
  let starPos = Math.random() * (maxPos - minPos + 1) + minPos;
  $(".starCount" + starCount).css("left", starPos + "px");

  //whenever a star reach top of screen - remove it from html to not run out of memory
  $(".starCount" + starCount).one(
    "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
    function (e) {
      $(this).remove();
    }
  );

  starCount++;
}

//setting interval to create a star every 100 ms
let starGenerator = setInterval(function () {
  createStar();
}, 100);
