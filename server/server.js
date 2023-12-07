// server library
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");

// server
const PORT = 12000;
app.use(cors());
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

function dbQueryAsync(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
}

app.get("/api/class", async (req, res) => {
  const user_number = "201911875";
  const sqlQuery = `select user_classes from user where user_number = '${user_number}'`;

  class_prof_json = [];

  var t = await dbQueryAsync(sqlQuery);
  var t1 = t[0];
  var s = t1.user_classes;
  s = s.replace(/\[/gi, "");
  s = s.replace(/\]/gi, "");
  s = s.replace(/\"/gi, "");
  s = s.replace(/ /gi, "");
  var classes = s.split(",");

  for (var i = 0; i < classes.length; ++i) {
    var sqlQuery2 = `select * from class where class_id = '${classes[i]}'`;
    var t2 = await dbQueryAsync(sqlQuery2);
    // console.log(t2[0]);
    class_prof_json.push(t2[0]);
    //     var t3 = t2[0];
    //     var s1 = t3.class_name;
    //     var s2 = t3.class_prof;
    //     class_prof_json[s1] = s2;
  }
  console.log(class_prof_json);
  res.json(class_prof_json);
});

let account = [
  {
    u_id: "",
    u_pw: "",
  },
];

app.post("/api/login", (req, res) => {
  // 데이터베이스에서 클래스 정보를 조회하는 쿼리 실행
  const query = "SELECT * FROM user WHERE user_number=?";

  const { u_id, u_pw } = req.body;
  account = [{ u_id, u_pw }];

  connection.query(query, [account[0].u_id], (error, results) => {
    if (error) {
      console.error("데이터베이스 조회 오류: ", error);
      res.status(500).send("서버 오류");
    } else {
      if (results.length >= 1) {
        let successCode = 0;

        if (account[0].u_id.length === 5) {
          successCode = 1;
        } else if (account[0].u_id.length === 9) {
          successCode = 2;
        } else if (account[0].u_id.length === 6) {
          successCode = 3;
        }

        res.json({ success: successCode });
      } else {
        res.json({ success: 0 });
      }
    }
  });
});

// web server call
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
