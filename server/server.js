// server library
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
// server
const app = express();
const PORT = 12000;
// database
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
connection.connect();

app.get("/api/src", (req, res) => {
  connection.query("SELECT * FROM user", (err, rows, fields) => {
    if (err) throw err;
    console.log("User info is: ", rows);
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
