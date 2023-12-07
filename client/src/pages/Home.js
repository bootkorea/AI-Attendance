import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import attendanceLog from "../data/attendanceLog";
import currentLecture from "../data/currentLecture";

function HomePage() {
  const [classData, setClassData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const apiUrl = "http://localhost:12000/api/class";

    axios
      .get(apiUrl)
      .then((response) => {
        // 받아온 데이터를 상태에 설정
        setClassData(response.data);
      })
      .catch((error) => console.error("데이터 가져오기 실패: ", error));
  }, []);

  const handleClassItemClick = (index) => {
    // 클릭한 인덱스를 기반으로 선택한 클래스 설정
    setSelectedClass(classData[index]);
  };

  return (
    <div>
      <header className={styles.Header_block}>
        <div className={styles.Profile}>
          <span>지수인</span> 님 | 컴퓨터공학부
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
            <h2>{currentLecture.currentLecture.name}</h2>
            <div>
              {currentLecture.currentLecture.time}
              <span>{currentLecture.currentLecture.attendance}</span>
            </div>
            <a href="#" className={styles.Attendance_button}>
              출석 체크 하러 가기
            </a>
          </div>
          <div className={styles.Log_block}>
            <h3>이전 출석 로그</h3>
            <div className={styles.attendance_Count}>출석 6회 | 결석 0회</div>
            <ul className={styles.Log_list}>
              <ol>
                {attendanceLog.logs.map((log, index) => (
                  <li key={index}>
                    {log.date} ({log.dayOfWeek}) {log.startTime} ~ {log.endTime}{" "}
                    - {log.attendance}
                  </li>
                ))}
              </ol>
            </ul>
          </div>
          <div>{selectedClass}</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
