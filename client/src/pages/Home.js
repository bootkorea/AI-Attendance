import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import { useLocation } from "react-router-dom";

function HomePage() {
  const [classData, setClassData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [logData, setLogData] = useState([]);

  const location = useLocation();
  const num = location.state.user_number;

  useEffect(() => {
    const apiUrl = "3.37.51.187:12000/api/class";
    const apiUrlUser = "3.37.51.187:12000/api/user";
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
    const apiUrlList = "3.37.51.187:12000/api/log";
    // 아래 코드에서 필요한 파라미터 및 데이터를 적절히 수정하세요
    axios
      .get(apiUrlList, {
        params: {
          u_num: num,
          c_id: classData[selectedClassIndex]?.class_id,
        },
      })
      .then((response) => {
        // 받아온 데이터를 상태에 설정
        console.log(classData[selectedClassIndex]?.class_id);
        console.log(response.data);
        setLogData(response.data);
      })
      .catch((error) => console.error("데이터 가져오기 실패: ", error));
  };

  // 이 함수는 selectedClassIndex가 업데이트될 때마다 호출됩니다.
  useEffect(() => {
    sendClassId();
  }, [classData]);

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
                <span>{classItem.class_prof} 교수님</span>
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
          </div>
          <div className={styles.Log_block}>
            <h3>출석 로그</h3>
            <ul>
              {logData.map((logGroup, index) => (
                <li key={index} className={styles.Class_list}>
                  {logGroup.map((log, innerIndex) => (
                    <li key={innerIndex}>{log.attendance_time}</li>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
