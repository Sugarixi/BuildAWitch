//all the modules needed
const express = require('express');
const path = require('path');
var mysql = require('mysql');

//initiate express server with port 3000
const app = express();
const port = 3000;

//setting up sql connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'buildwitch',
    multipleStatements: true
});
//create a sql connection
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

//setting up server to accept body as part of the requests so we will be able to read the data the user sent us from client
app.use(express.json());

//setting up all the static files to be accessible (css, js and html files)
app.use('/', express.static(__dirname + "/Client"));

//the login
app.post('/Login', function (req, res) {
    //read username and password from the request body
    const userName = req.body.userName;
    const password = req.body.password;

    //initiate the response object we will send back to the client
    let responseObject = {};

    //running the sql query to get a user with same name and password
    var sql = "select * from users where users.userId='" + userName + "' and users.password=PASSWORD('" + password + "')";
    con.query(sql, function (err, result) {
        if (err) throw err; //if query failed - return error
        if (result.length > 0) { //if query succeeded and we got atleast one row back from the sql

            //initiate values in the response object. the user id, user points and user equipped set
            responseObject.userId = result[0].userId;
            responseObject.points = result[0].points;
            responseObject.equippedSet = result[0].equippedSet;

            //running the sql query to get all purchased set of the user
            sql = "select * from `usersets` INNER JOIN `sets` on sets.id = usersets.setId where usersets.userId='" + result[0].id + "'";
            con.query(sql, function (err2, result2) {
                if (err2) throw err; //if query failed - return error
                if (result2.length > 0) { //if query succeeded and we got atleast one purchased set for the user - return the set names to the client
                    responseObject.sets = result2.map(s => s.name);
                }
                res.json({ user: responseObject });
            });
        }
        else
            res.sendStatus(401); //if first sql query returned no users that means the credentials dont exist and we return 401 unauthorized
    });
});

//the register
app.post('/Register', function (req, res) {
    //read username email and password from the request body
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    //running the sql query to check if there are already users with same name or email
    var sql = "select * from users where userId='" + userName + "' or email='" + email + "'";
    con.query(sql, function (err, result) {
        if (err) throw err; //if query failed - return error
        if (result.length > 0) { //if we got one or more rows from the sql that means there is a user with same name or email therefore we return an error
            res.sendStatus(500);
        }
        else { //if the sql returned no rows that means the name and email are unique and we can continue creating the user

            //running the sql query to create a new user in the database
            var sql = "INSERT INTO users (`userId`, `password`, `email`, `points`) VALUES ('" + userName + "', PASSWORD('" + password + "'), '" + email + "', 0);";
            con.query(sql, function (err2, result2) {
                if (err2) throw err; //if query failed - return error
                res.sendStatus(200); //otherwise return 200 (successfully performed the registeration)
            });
        }
    });
});

//the password change
app.post('/ChangePassword', function (req, res) {
    //read username old password and new password from the request body
    const userName = req.body.userName;
    const passOld = req.body.passOld;
    const passNew = req.body.passNew;

    //running the sql query to update password for the user
    var sql = "update users set password=PASSWORD('" + passNew + "') where userId='" + userName + "' and password=PASSWORD('" + passOld + "')";
    con.query(sql, function (err, result) {
        if (err) throw err; //if query failed - return error
        if (result.affectedRows > 0) { //if a row in the sql was affected by the query that means the password has been updated successfully
            res.sendStatus(200);
        }
        else { //if no rows were affected by the UPDATE query that means the username and old password were not correct and no user with those credentials was found
            res.sendStatus(401); //returning 401 unauthorized
        }
    });
});

//updating user points
app.post('/UpdatePoints', function (req, res) {
    //read username and points from the request body
    const userName = req.body.userId;
    const points = req.body.points;

    //running the sql query to update user points
    var sql = "update users set points='" + points + "' where userId='" + userName + "'";
    con.query(sql, function (err, result) {
        if (err) throw err; //if query failed - return error
        if (result.affectedRows > 0) { //if a row in the sql was affected by the query that means the points has been updated successfully
            res.sendStatus(200);
        }
        else { //if no rows were affected by the UPDATE query that means there is no user with that username
            res.sendStatus(401); //returning 401 unauthorized
        }
    });
});

//equipping a set
app.post('/EquipSet', function (req, res) {
    //read username and set id from the request body
    const userName = req.body.userId;
    const setId = req.body.equippedSet ? req.body.equippedSet : "null";

    //running the sql query to update user equipped set
    var sql = "update users set equippedSet=" + setId + " where userId='" + userName + "'";
    con.query(sql, function (err, result) {
        if (err) throw err; //if query failed - return error
        if (result.affectedRows > 0) { //if a row in the sql was affected by the query that means the equipped set has been updated successfully
            res.sendStatus(200);
        }
        else { //if no rows were affected by the UPDATE query that means there is no user with that username
            res.sendStatus(401); //returning 401 unauthorized
        }
    });
});

//buy a set for user
app.post('/BuySet', function (req, res) {
    //read username and set id from the request body
    const userName = req.body.userId;
    const setId = req.body.setId;

    var cost = 0; //declaring a variable to hold the set cost for future use

    //running the sql query to get the amount of points the set cost
    sql = "select points from sets where id=" + setId;
    con.query(sql, function (err, result) {
        if (err) throw err; //if query failed - return error
        if (result.length > 0) { //if query succeeded and we got atleast one row back from the sql which is the set cost
            cost = result[0].points; //set the cost variable to be the set cost

            //running the sql query to get the user data
            sql = "select * from users where userId='" + userName + "'";
            con.query(sql, function (err2, result2) {
                if (err2) throw err2; //if query failed - return error
                if (result2.length > 0) { //if query succeeded and we got atleast one row back from the sql which is the user data
                    var userId = result2[0].id; //read the user id from the sql result
                    var newPoints = result2[0].points - cost; //read the user points from the sql result and subsctract the set cost from it

                    //if user able to afford the set (extra protection)
                    if (newPoints >= 0) {
                        //running the sql query to update user new points after purchase as well as creating new relation between user and the new purchased set in the usersets table
                        sql = "update users set points=" + newPoints + " where userId='" + userName + "'; INSERT INTO `usersets` (`userId`, `setId`) VALUES ('" + userId + "', '" + setId + "');";
                        con.query(sql, function (err3, result3) {
                            if (err3) { res.sendStatus(500); return; }; //if query failed - return error
                            if (result3[1].affectedRows > 0) { //if a new row was added that means the set has been added successfully to the user
                                res.json({ points: newPoints }); //return the new points the user has so the UI can be updated
                            }
                            else { //error updating new points and/or inserting new set to user owned sets
                                res.sendStatus(500); //returning 500 error
                            }
                        });
                    }
                    else { //if newPoints lower than zero that means the user cant buy the set and tried to hack
                        res.sendStatus(401); //returning 401 unauthorized
                    }
                }
                else { //if first sql query returned no users that means the credentials dont exist
                    res.sendStatus(401); //returning 401 unauthorized
                }
            });
        }
        else { //if no set with the id was found
            res.sendStatus(500); //returning 500 error
        }
    });
});

//start the backend server, going live
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});