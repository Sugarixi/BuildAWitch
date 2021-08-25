let starCount = 0;
function createStar() {
  let starClassNames =
    "starCount" + starCount + " star" + (Math.floor(Math.random() * 2) + 1);
  //add a new star
  $(".starsBackground").append('<div class="' + starClassNames + '"></div>');
  //randomize star position
  let minPos = 0;
  let maxPos = screen.width;
  let starPos = Math.random() * (maxPos - minPos + 1) + minPos;
  $(".starCount" + starCount).css("left", starPos + "px");

  $(".starCount" + starCount).one(
    "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
    function (e) {
      $(this).remove();
    }
  );

  starCount++;
}

let starGenerator = setInterval(function () {
  createStar();
}, 100);
