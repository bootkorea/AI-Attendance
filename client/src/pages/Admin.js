import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Admin.module.css";
import { useLocation } from "react-router-dom";

function AdminPage() {
  const [classData, setClassData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [logData, setLogData] = useState([]);
  const [file, setFile] = useState(null);

  const location = useLocation();
  const num = location.state.user_number;

  useEffect(() => {
    const apiUrl = "http://localhost:12000/api/class";
    const apiUrlUser = "http://localhost:12000/api/user";
    axios
      .get(apiUrl, {
        params: {
          u_num: num,
        },
      })
      .then((response) => {
        // 받아온 데이터를 상태에 설정
        setClassData(response.data);
        // setSelectedClass(response.data[0]);
      })
      .catch((error) => console.error("데이터 가져오기 실패: ", error));
    axios
      .get(apiUrlUser, {
        params: {
          u_num: num,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => console.error("나가 하지마"));
  }, []);

  const handleClassItemClick = (index) => {
    // 클릭한 인덱스를 기반으로 선택한 클래스 설정
    console.log(index);
    setSelectedClassIndex(index);
    sendClassId();
    // setSelectedClass(classData[index]);
  };

  const sendClassId = () => {
    const apiUrlList = "http://localhost:12000/api/list";
    // 아래 코드에서 필요한 파라미터 및 데이터를 적절히 수정하세요
    axios
      .get(apiUrlList, {
        params: {
          c_id: classData[selectedClassIndex]?.class_id,
        },
      })
      .then((response) => {
        // 받아온 데이터를 상태에 설정
        console.log(classData[selectedClassIndex]?.class_id);
        console.log(response.data);
      })
      .catch((error) => console.error("데이터 가져오기 실패: ", error));
  };

  // 이 함수는 selectedClassIndex가 업데이트될 때마다 호출됩니다.
  useEffect(() => {
    sendClassId();
  }, [classData]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    if (!file) {
      alert("파일을 선택 후 업로드 버튼을 눌러 주세요.");
      return;
    }
    alert("파일이 업로드 되었습니다.");

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1을 해줌
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");

    const filename = `${year}${month}${day}${hours}${minutes}`;
    setDateData(`${year}년 ${month}월 ${day}일 ${hours}:${minutes}`);
    const sibal = "http://localhost:12000/apt";
    const sibal2 = "http://localhost:12000/api/upload";
    axios
      .all([
        axios.post(sibal2, formData, {
          params: {
            c_id: classData[selectedClassIndex]?.class_id,
            f_name: filename,
          },
        }),
        axios.post(sibal, formData, {
          params: {
            c_id: classData[selectedClassIndex]?.class_id,
            f_name: filename,
          },
        }),
      ])
      .then(
        axios.spread((res1, res2) => {
          console.log("res2.data");
          console.log(res2.data);
          setLogData(res2.data);
        })
      )
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };
  return (
    <div>
      <header className={styles.Header_block}>
        <div className={styles.Profile}>
          {userData.map((userItem, index) => (
            <span>
              {userItem.user_name} 님 | {userItem.user_major}
            </span>
          ))}
        </div>
      </header>
      <div className={styles.Body_block}>
        <div className={styles.Left_block}>
          <h2>수업 목록</h2>
          <ul className={styles.Class_list}>
            {classData.map((classItem, index) => (
              <li key={index} onClick={() => handleClassItemClick(index)}>
                {classItem.class_name} ({classItem.class_sep})
                <span className={styles.Name}>
                  {classItem.class_prof} 교수님
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.Right_block}>
          <div className={styles.Class_block}>
            <h2>
              {classData[selectedClassIndex]?.class_name} (
              {classData[selectedClassIndex]?.class_sep})
            </h2>
            <div>
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleUpload}>Upload</button>
            </div>
          </div>
          <div className={styles.List_block}>
            <h2>{dateData} 학생 리스트</h2>
            <ul className={styles.Class_list}>
              {logData.map((attendance, index) => (
                <li key={index}>
                  {attendance.attendance_student} (
                  {attendance.attendance_student})
                  <span
                    className={
                      attendance.attendance_att === "출석"
                        ? styles.green
                        : styles.red
                    }
                  >
                    {attendance.attendance_att}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* <div>
            {lambdaData.map((lambdaItem, index) => (
              <div key={index}>
                <p>{lambdaItem.image}</p>
                <p>{lambdaItem.similarity} 정확도</p>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
