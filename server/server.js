// server library
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();

// server
const PORT = 12000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/build")));

app.listen(PORT, function () {
  console.log("listen on 12000");
});

// database
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
connection.connect();

app.get("/auth", (req, res) => {
  connection.query("SELECT * FROM user", (err, rows, fields) => {
    if (err) throw err;
    console.log("User info is: ", rows);
  });
  connection.query("SELECT * FROM class", (err, rows, fields) => {
    if (err) throw err;
    console.log("User info is: ", rows);
  });
});

// web server call
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
