//when document done loading - get all login menu buttons
$( document ).ready(function() {
	$('#loginContainer').load('/views/login.html', function() {
        x = document.getElementById("login");
        y = document.getElementById("register");
        z = document.getElementById("changePass");

        b = document.getElementById("btn");
    });
});

//move the login div in the login screen to center
function login(){
    x.style.left = "50px"
    y.style.left = "450px"
    b.style.left = "0"
    b.style.width = "80px"
    z.style.left = "850px"
}

//move the register div in the login screen to center
function register(){
    x.style.left = "-400px"
    y.style.left = "50px"
    b.style.left = "80px"
    b.style.width = "90px"
    z.style.left = "450px"
}

//move the change password div in the login screen to center
function change(){
    x.style.left = "-850px"
    y.style.left = "-450px"
    b.style.left = "170px"
    b.style.width = "155px"
    z.style.left = "50px"
}

//try logging in the user
function tryLogin() {
    var isValid = $("#login")[0].reportValidity(); //check if user input is valid
    if (!isValid) return false;

    let data = { //get the user input values
        userName: $("#loginName").val(),
        password: $("#loginPassword").val(),
    };

    fetch("/Login", {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function(res) { 
        if (res.status != 200) //if there was error in the server (internal or unauthorized) - display error message
            alert("User credentials did not match");
        else
            return res.json(); //if login succeed - read response data
    })
    .then(function(userData) { //once finishing reading response - initiate app
        if (userData) { //if login was successful
            window.loggedUser = userData.user; //set global user to be the logged user
            $('#appContainer').load('/views/main.html', function() { //load the main.html content into the main div
                LoadMain(); //initiate all main page animations and values

                //animate login div out of screen and bring main div to screen
                $('#loginContainer')[0].classList.add("animateWushTop");
                $('#appContainer')[0].classList.add("animateWushView");

                //keep animation margin-top value after the animation ends
                $('#loginContainer').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
                    $(this).css("margin-top", "-100vh");
                    $(this)[0].classList.remove("animateWushTop");
                });
                $('#appContainer').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
                    $(this).css("margin-top", "0vh");
                    $(this)[0].classList.remove("animateWushView");
                });
            });
        }
    });
}

//try registering a user
function tryRegister() {
    var isValid = $("#register")[0].reportValidity(); //check if user input is valid
    if (!isValid) return false;
    
    let data = { //get the user input values
        userName: $("#registerName").val(),
        email: $("#registerEmail").val(),
        password: $("#registerPassword").val(),
    };

    fetch("/Register", {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function(res) {
        if (res.status == 200) //if no error occured - display success message
            alert("User registeration successful");
        else
            alert("userId or email already in use.");
    });
}

//try changing password for the user
function tryChangePassword() {
    var isValid = $("#changePass")[0].reportValidity(); //check if user input is valid
    if (!isValid) return false;
    
    let data = { //get the user input values
        userName: $("#changeName").val(),
        passOld: $("#changePassOld").val(),
        passNew: $("#changePassNew").val(),
    };

    fetch("/ChangePassword", {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function(res) {
        if (res.status == 200) //if no error occured - display success message
            alert("Password has been changed successfully");
        else
            alert("UserId or Password is incorrect.");
    });
}