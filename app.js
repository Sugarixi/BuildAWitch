const express = require('express');
const path = require('path');
var mysql = require('mysql');
const app = express();
const port = 3000;

var con = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'buildwitch',
    multipleStatements: true
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.json());
app.use('/',express.static(__dirname + "/Client"));

app.post('/Login', function(req, res) {
    const userName = req.body.userName;
    const password = req.body.password;
    let responseObject = {};
    var sql = "select * from users where users.userId='" + userName + "' and users.password='" + password + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            responseObject.userId = result[0].userId;
            responseObject.points = result[0].points;
            responseObject.equippedSet = result[0].equippedSet;
            sql = "select * from `usersets` INNER JOIN `sets` on sets.id = usersets.setId where usersets.userId='" + result[0].id + "'";
            con.query(sql, function (err2, result2) {
                if (err2) throw err;
                if (result2.length > 0) {
                    responseObject.sets = result2.map(s => s.name);   
                }
                res.json({ user : responseObject });
            });
        }
        else
            res.sendStatus(401);
    });
});

app.post('/Register', function(req, res) {
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    var sql = "select * from users where userId='" + userName + "' or email='" + email + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.sendStatus(500);
        }
        else {
            var sql = "INSERT INTO users (`userId`, `password`, `email`, `points`) VALUES ('" + userName + "', '" + password + "', '" + email + "', 0);";
            con.query(sql, function (err2, result2) {
                if (err2) throw err;
                res.sendStatus(200);
            });
        }
    });
});

app.post('/ChangePassword', function(req, res) {
    const userName = req.body.userName;
    const passOld = req.body.passOld;
    const passNew = req.body.passNew;
    var sql = "update users set password='" + passNew + "' where userId='" + userName + "' and password='" + passOld + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
    });
});

app.post('/UpdatePoints', function(req, res) {
    const userName = req.body.userId;
    const points = req.body.points;
    var sql = "update users set points='" + points + "' where userId='" + userName + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
    });
});

app.post('/EquipSet', function(req, res) {
    const userName = req.body.userId;
    const setId = req.body.equippedSet ? req.body.equippedSet : "null";
    var sql = "update users set equippedSet=" + setId + " where userId='" + userName + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(401);
        }
    });
});

app.post('/BuySet', function(req, res) {
    const userName = req.body.userId;
    const setId = req.body.setId;
    var cost = 0;
    sql = "select points from sets where id=" + setId;
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            cost = result[0].points;
            sql = "select * from users where userId='" + userName + "'";
            con.query(sql, function (err2, result2) {
                if (err2) throw err2;
                var userId = result2[0].id;
                var newPoints = result2[0].points - cost;
                if (result2.length > 0 && newPoints > 0) {
                    sql = "update users set points=" + newPoints + " where userId='" + userName + "'; INSERT INTO `usersets` (`userId`, `setId`) VALUES ('" + userId + "', '" + setId + "');";
                    con.query(sql, function (err3, result3) {
                        if (err3) { res.sendStatus(500); return; };
                        if (result3[1].affectedRows > 0) {
                            res.json({points: newPoints});
                        }
                        else {
                            res.sendStatus(500);
                        }
                    });
                }
                else {
                    res.sendStatus(401);
                }
            });
        }
        else {
            res.sendStatus(401);
        }
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});