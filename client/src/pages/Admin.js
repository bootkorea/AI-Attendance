import styles from '../styles/Admin.module.css';
import userCourses from '../data/userCourses';
import currentLecture from '../data/currentLecture';

function AdminPage() {
  return(
    <div>
      <header className="Header_block">
        <div className="Profile">
          <span>지수인</span> 님 | 컴퓨터공학부
        </div>
      </header>
      <div className="Body_block">
        <div className="Left_block">
          <h2>수업 목록</h2>
          <ul className="Class_list">
            {userCourses.courses.map((course, index) => (
              <li key={index}>
                {course.courseName} <span>{course.professorName} 교수님</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="Right_block">
          <div className="Class_block">
            <h2>{currentLecture.currentLecture.name}</h2>
            <div>
            {currentLecture.currentLecture.time}<span>(48/48)</span>
            </div>
          </div>
          <div className="Current_block">
            <div className="Log_block">
              <h2>[11:30] 출석 로그</h2>
            </div>
            <div className="List_block">
              <h2>학생 리스트</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;