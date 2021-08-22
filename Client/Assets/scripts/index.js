$( document ).ready(function() {
	$('#loginContainer').load('/views/login.html', function() {
        x = document.getElementById("login");
        y = document.getElementById("register");
        z = document.getElementById("changePass");

        b = document.getElementById("btn");
    });
});

function login(){
    x.style.left = "50px"
    y.style.left = "450px"
    b.style.left = "0"
    b.style.width = "80px"
    z.style.left = "850px"
}

function register(){
    x.style.left = "-400px"
    y.style.left = "50px"
    b.style.left = "80px"
    b.style.width = "90px"
    z.style.left = "450px"
}

function change(){
    x.style.left = "-850px"
    y.style.left = "-450px"
    b.style.left = "170px"
    b.style.width = "155px"
    z.style.left = "50px"
}

function tryLogin() {
    var isValid = $("#login")[0].reportValidity();
    if (!isValid) return false;

    let data = {
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
        if (res.status != 200)
            alert("NO");
        else
            return res.json();
    })
    .then(function(userData) {
        window.loggedUser = userData.user;
        $('#appContainer').load('/views/main.html', function() {
            LoadMain();
            $('#loginContainer')[0].classList.add("animateWushTop");
            $('#appContainer')[0].classList.add("animateWushView");

            $('#loginContainer').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
                $(this).css("margin-top", "-100vh");
                $(this)[0].classList.remove("animateWushTop");
            });

            $('#appContainer').one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
                $(this).css("margin-top", "0vh");
                $(this)[0].classList.remove("animateWushView");
            });
        });
    });
}

function tryRegister() {
    var isValid = $("#register")[0].reportValidity();
    if (!isValid) return false;
    
    let data = {
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
        if (res.status == 200)
            alert("AWESOME");
        else
            alert("userId or email already in use.");
    });
}

function tryChangePassword() {
    var isValid = $("#changePass")[0].reportValidity();
    if (!isValid) return false;
    
    let data = {
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
        if (res.status == 200)
            alert("CHANGED");
        else
            alert("UserId or Password is incorrect.");
    });
}

/*window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href
    }, 500)
}

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
})*/