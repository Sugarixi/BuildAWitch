//initializing closet images and button texts
function initCloset() {
    if (!window.loggedUser.sets)
        window.loggedUser.sets = [];

    window.loggedUser.sets.forEach(function(s) {
        $("#closet" + s + "Container").find("img")[0].classList.remove("grayscale"); //grayscaling sets the user doesnt own
        $("#closet" + s + "Container").find("button").html("Equip"); //changing button text to "equip" on sets user owns
    });
}

//equip/buy set when user clicks on the button
function activateSet(btn, setId, setName) {
    if (btn.innerText === "Equip") //if the button text is equip - equip the set and go back to main page
        equipSet(setId);
    else //buying the set and equip it to be the active set
        buySet(setId, function() {
            window.loggedUser.sets.push(setName);
            initCloset();
            equipSet(setId);
            gotoPage("mainContent");
        });
}

//equips the set
function equipSet(setId) {
    var oldSetId = setId;
    window.loggedUser.equippedSet = setId;
    fetch("/EquipSet", { //update database that user has equipped a new set and make it the current active set
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(window.loggedUser)
    }).then(function(res) {
        let newSetId = setId ? setId+1 : 1;
        if (res.status == 200) { //if action succeeded (code 200) - active the set in the UI and go to main page
            $(".mainCharacter")[0].src = "Assets/images/character" + newSetId + ".png";
            gotoPage("mainContent");
        }
        else { //if action failed - rollback to old active set
            window.loggedUser.equippedSet = oldSetId;
        }
    });
}

//buying a set
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
        if (res.status == 200) { //if action succeeded (code 200) - read response data
            return res.json();
        }
        //if any error occured on the server (internal 500 or unauthorized 401) - display an error message
        else if (res.status == 500) {
            alert("error occured");
        }
        else {
            alert("you don't have enough points!");
        }
    }).then(function(data) { //once finishing reading response - update user points in the ui and go back to the function
        window.loggedUser.points = data.points;
        $(".pointsContainer").html(window.loggedUser.points);
        callback();
    });
}