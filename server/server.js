// server library
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");
var request = require("request");

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

app.get("/api/user", async (req, res) => {
  const user_number = req.query.u_num;
  const sqlQuery = `select * from user where user_number = '${user_number}'`;
  user_json = [];

  var t = await dbQueryAsync(sqlQuery);
  var t1 = t[0];
  // var u_name = t1.user_name;
  // var u_major = t1.user_major;
  user_json.push(t1);

  res.json(user_json);
});
let account = [
  {
    u_id: "",
    u_pw: "",
  },
];

app.get("/lambda", (req, res) => {
  const lambdaUrl =
    "https://fs27p7cyza.execute-api.ap-northeast-2.amazonaws.com/beta/rekognition";

  lambda_json = [];
  request(lambdaUrl, function (error, response, body) {
    if (error) {
      console.log("error");
    }
    var t1 = JSON.parse(body);
    var t2 = JSON.parse(t1.body);
    console.log(t2);
    res.send(t2);
  });
});

app.get("/api/class", async (req, res) => {
  const user_number = req.query.u_num;
  const sqlQuery = `select * from user where user_number = '${user_number}'`;
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

    class_prof_json.push(t2[0]);
  }
  console.log(class_prof_json);
  res.json(class_prof_json);
});

app.post("/api/login", async (req, res) => {
  try {
    const { u_id, u_pw } = req.body;
    account = [{ u_id, u_pw }];

    const query = `SELECT * FROM user WHERE user_number='${account[0].u_id}'`;
    const results = await dbQueryAsync(query);

    if (results.length >= 1) {
      const storedUser = results[0];
      let successCode = 0;

      if (
        account[0].u_id.length === 5 &&
        account[0].u_pw === storedUser.user_pw
      ) {
        successCode = 1;
      } else if (
        account[0].u_id.length === 9 &&
        account[0].u_pw === storedUser.user_pw
      ) {
        successCode = 2;
      } else if (account[0].u_id.length === 6 && account[0].u_pw === "1234") {
        successCode = 3;
      }

      res.json({ success: successCode });
    } else {
      res.json({ success: 0 });
    }
  } catch (error) {
    console.error("데이터베이스 조회 오류: ", error);
    res.status(500).send("서버 오류");
  }
});

// 입력: (교수명) + 수업명
// 출력: 학생목록
app.get('/api/list', async (req, res) => {
  // const prof_name = "KDK";
  const class_id = req.query.c_id;
  const listQuery = `SELECT class_students FROM class WHERE class_id = '${class_id}'`;
  result = [];
    
    
    var data = await dbQueryAsync(listQuery);
    
    try {
      // class_students 속성에 접근하여 JSON 문자열을 파싱하여 배열로 변환
      const studentsArray = JSON.parse(data[0].class_students);

      studentsArray.forEach((student, index) => {
        console.log(`Student ${index + 1}: ${student}`);
      });
      for(var i = 0; i < studentsArray.length; ++i) {
      const Query2 = `select * from user where user_number = '${studentsArray[i]}'`;
      var t = await dbQueryAsync(Query2);
      result.push(t);
      }
    } catch (error) {
      console.error("JSON 파싱 오류 또는 데이터가 유효하지 않습니다.", error);
    }
    console.log(result);
    res.json(result);
});

// web server call
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
