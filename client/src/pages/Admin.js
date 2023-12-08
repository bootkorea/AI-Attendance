import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Admin.module.css";
import currentLecture from "../data/currentLecture";
import { useLocation } from "react-router-dom";

function AdminPage() {
  const [classData, setClassData] = useState([]);
  const [lambdaData, setLambdaData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [logData, setLogData] = useState([]);

  const location = useLocation();
  const num = location.state.user_number;

  useEffect(() => {
    const apiUrl = "http://localhost:12000/api/class";
    const apiUrlUser = "http://localhost:12000/api/user";
    const GatewayUrl = "http://localhost:12000/lambda";
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
            <h2>{classData[selectedClassIndex]?.class_name} ({classData[selectedClassIndex]?.class_sep})
            </h2>
          </div>
          <div className={styles.List_block}>
            <h2>학생 리스트</h2>
            <ul className={styles.Class_list}>
              {logData.map((logItemArray, index) => (
                // 각 배열의 첫 번째 원소에 접근하여 user_name을 출력
                <li key={index}>
                  {logItemArray[0].user_name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            {lambdaData.map((lambdaItem, index) => (
              <div key={index}>
                <p>{lambdaItem.image}</p>
                <p>{lambdaItem.similarity} 정확도</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
