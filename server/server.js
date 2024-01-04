// server library
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");
const multer = require("multer");
var request = require("request");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

// server
const PORT = 12000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/build")));

// EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../view"));

app.listen(PORT, function () {
  console.log("listen on 12000");
});

// s3
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "group-photo-bucket",
    acl: "public-read", // Access control list (ACL) 설정
    key: function (req, file, cb) {
      const classId = req.query.c_id;
      const dateData = req.query.f_name;

      const filename = `${classId}/${dateData}`;
      cb(null, filename);
    },
  }),
});

// 파일 업로드 엔드포인트
app.post("/api/upload", upload.single("file"), (req, res) => {
  // 파일이 업로드되면 이 부분에서 파일 정보를 처리할 수 있습니다.
  console.log("File uploaded:", req.file);
  res.json({ message: "File uploaded successfully" });
});

// database
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
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
  const lambdaUrl = "Lambda_ENDPOINT";

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
app.get("/api/list", async (req, res) => {
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
    for (var i = 0; i < studentsArray.length; ++i) {
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

app.get("/api/log", async (req, res) => {
  const user_number = req.query.u_num;
  const class_id = req.query.c_id;
  const sqlQuery = `select * from class where class_id = '${class_id}'`;

  class_json = [];
  attendance_json = [];
  result = [];

  var t = await dbQueryAsync(sqlQuery);
  // t 자체가 RowDataPacket JSON으로 이루어진 배열이다
  // result.push(t);

  const sqlQuery2 = `select * from attendance where attendance_id = '${class_id}' and attendance_student = '${user_number}'`;
  var t2 = await dbQueryAsync(sqlQuery2);

  result.push(t2);
  res.json(result);
  console.log("——");
  console.log(result);
});

// web server call
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.post("/lambda", async (req, res) => {
  console.log(req.body);

  classID = req.body[0]["class_id"];
  filename = req.body[1]["date"];
  console.log("LAMBDA LAMBDA LLLL");
  console.log(classID);
  console.log(filename);
  const listQuery = `SELECT class_students FROM class WHERE class_id = '${classID}'`;
  result = [];
  var data = await dbQueryAsync(listQuery);
  var attendance_map = new Map();

  try {
    // class_students 속성에 접근하여 JSON 문자열을 파싱하여 배열로 변환
    var s = data[0].class_students;
    s = s.replace(/\[/gi, "");
    s = s.replace(/\]/gi, "");
    s = s.replace(/\"/gi, "");
    s = s.replace(/ /gi, "");
    var class_students = s.split(",");

    for (var i = 2; i < req.body.length; ++i) {
      var student = req.body[i].image.substring(0, 9);
      attendance_map.set(student, 1);
    }

    for (var i = 0; i < class_students.length; ++i) {
      if (attendance_map.has(class_students[i])) {
        const attQuery = `insert into attendance(attendance_student, attendance_id, attendance_time, attendance_att) values('${class_students[i]}', '${classID}', '${filename}', '출석')`;
        await dbQueryAsync(attQuery);
      } else {
        const attQuery = `insert into attendance(attendance_student, attendance_id, attendance_time, attendance_att) values('${class_students[i]}', '${classID}', '${filename}', '결석')`;
        await dbQueryAsync(attQuery);
      }
    }
    const resQuery = `select * from attendance where attendance_id = '${classID}' and attendance_time = '${filename}'`;
    var result = await dbQueryAsync(resQuery);
    console.log("--------");
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("JSON 파싱 오류 또는 데이터가 유효하지 않습니다.", error);
  }
});

app.post("/apt", async (req, res) => {
  const classID = req.query.c_id;
  const filename = req.query.f_name;
  console.log("LAMBDA LIST START");

  try {
    const resQuery = `select * from attendance where attendance_id = '${classID}' and attendance_time = '${filename}'`;
    // dbQueryAsync가 Promise를 반환한다고 가정하고 await를 사용
    var result;
    await setTimeout(async function () {
      result = await dbQueryAsync(resQuery);
      console.log("lambda list -------");
      console.log(result);
      res.json(result);
    }, 30000);
  } catch (error) {
    console.error("DB에 정보가 저장되어 있지 않습니다.", error);
  }
});
