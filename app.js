const express = require('express')
const app = express()
const fs = require('fs')
const uuidv4 = require('uuid/v4');



var db = JSON.parse(fs.readFileSync(__dirname + "/db.json"));
var wait = JSON.parse(fs.readFileSync(__dirname + "/for_review.json"));


const dir = __dirname + "/static/"
app.get('/', function(req, res) {
    res.sendFile(dir + "index.html");
});

var ad = JSON.stringify({"t": ["<font color='red'>unknown</font>"], "w": "aI"});
app.get('/api/word/:translation/:word', function(req, res) {
    var type = req.params.translation;
    var word = req.params.word;
    if (typeof db[type][word] == 'undefined') {
        res.send(ad);
    } else {
    res.send(db[type][word]);
    }
});

app.get('/api/check/:word', function(req, res) {
    var type = "en-es";
    var word = req.params.word;
    if (typeof db[type][word] == 'undefined') {
        res.send("false");
    } else {
    res.send("true");
    }
});


app.get("/refdb", function(req,res) {
    var db = JSON.parse(fs.readFileSync(__dirname + "/db.json"));
    res.send("done");
});

app.get("/adddb", function(req,res) {
    res.sendFile(dir + "add.html");
});


app.get("/new", function(req,res) {
    res.sendFile(dir + "singleadd.html");
});

app.get("/toCheck/:auth", function(req,res) {
   if (req.params.auth == "PasswordQWERTY1") {
       res.send(wait);
   } else {
       res.send("Authentication rejected");
   }
});

app.get("/confirm/:auth", function(req,res) {
   if (req.params.auth == "PasswordQWERTY1") {
       res.sendFile(dir + "check.html");
       console.log("Checker signed in");
   } else {
       res.send("Authentication rejected");
   }
});
app.get("/api/add/:translation/:term/:def/:by", function(req,res) {
    wait[req.params.translation][uuidv4()] = {"e": req.params.term, "t": req.params.def, "w": req.params.by}
    res.send('true');
    fs.writeFileSync("for_review.json", JSON.stringify(wait));
});


app.get("/aN/true/:id/:auth/:translation", function(req,res) {
       if (req.params.auth == "PasswordQWERTY1") {
           var cR = wait[req.params.translation][req.params.id];
           db[req.params.translation][cR["e"]] = {"t": cR["t"], "w": cR["w"]}
           delete wait[req.params.translation][req.params.id];
       res.send("<font color='green'>Added</font>");
           fs.writeFileSync("for_review.json", JSON.stringify(wait));
              fs.writeFileSync("db.json", JSON.stringify(db));

   } else {
       res.send("<font color='red'>Authentication Rejected</font>")
   }
});

app.get("/aN/false/:id/:auth/:translation", function(req,res) {
       if (req.params.auth == "PasswordQWERTY1") {
           delete wait[req.params.translation][req.params.id];
       res.send("<font color='green'>Rejected</font>");
       fs.writeFileSync("for_review.json", JSON.stringify(wait));
       fs.writeFileSync("db.json", JSON.stringify(db));
   } else {
       res.send("<font color='red'>Authentication Rejected</font>")
   }
});

app.listen(8080, () => console.log('listening on port 8080'))