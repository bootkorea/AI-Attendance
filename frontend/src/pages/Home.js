import '../styles/Home.css';
import userCourses from '../data/userCourses';
import attendanceLog from '../data/attendanceLog';
import currentLecture from '../data/currentLecture';

function HomePage() {
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
            {currentLecture.currentLecture.time}<span>{currentLecture.currentLecture.attendance}</span>
            </div>
            <a href="#" className='Attendance_button'> 출석 체크 하러 가기</a>
          </div>
          <div className="Log_block">
            <h3>이전 출석 로그</h3>
            <div className="attendance_Count">
              출석 6회 | 결석 0회
            </div>
            <ul className="Log_list">
              <ol>
                {attendanceLog.logs.map((log, index) => (
                  <li key={index}>
                    {log.date} ({log.dayOfWeek}) {log.startTime} ~ {log.endTime} - {log.attendance}
                  </li>
                ))}
              </ol>
            </ul>
          </div>
          <div className="NextClass_block">
            <h3>다음 수업 예정</h3>
            <span>{currentLecture.nextLecture.time}</span> <span>{currentLecture.nextLecture.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;