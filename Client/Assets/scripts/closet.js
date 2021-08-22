function initCloset() {
    if (!window.loggedUser.sets)
        window.loggedUser.sets = [];

    window.loggedUser.sets.forEach(function(s) {
        $("#closet" + s + "Container").find("img")[0].classList.remove("grayscale");
        $("#closet" + s + "Container").find("button").html("Equip");
    });
}

function activateSet(btn, setId, setName) {
    if (btn.innerText === "Equip")
        equipSet(setId);
    else
        buySet(setId, function() {
            window.loggedUser.sets.push(setName);
            initCloset();
            equipSet(setId);
            gotoPage("mainContent");
        });
}

function equipSet(setId) {
    var oldSetId = setId;
    window.loggedUser.equippedSet = setId;
    fetch("/EquipSet", {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(window.loggedUser)
    }).then(function(res) {
        let newSetId = setId ? setId+1 : 1;
        if (res.status == 200) {
            $(".mainCharacter")[0].src = "Assets/images/character" + newSetId + ".png";
            gotoPage("mainContent");
        }
        else {
            window.loggedUser.equippedSet = oldSetId;
        }
    });
}

function buySet(setId, callback) {
    let data = {
        userId: window.loggedUser.userId,
        setId: setId
    }
    fetch("/BuySet", {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function(res) {
        if (res.status == 200) {
            return res.json();
        }
        else if (res.status == 500) {
            alert("error occured");
        }
        else {
            alert("you don't have enough points!");
        }
    }).then(function(data) {
        window.loggedUser.points = data.points;
        $(".pointsContainer").html(window.loggedUser.points);
        callback();
    });
}