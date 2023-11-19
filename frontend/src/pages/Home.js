import './Home.css';

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
            <li>클라우드컴퓨팅 (1분반) <span>강동기 교수님</span></li>
            <li>컴퓨터공학총론 (1분반) <span>오일석 교수님</span></li>
            <li>모바일프로그래밍 (1분반) <span>강동기 교수님</span></li>
            <li>알고리즘 (4분반) <span>이성현 교수님</span></li>
            <li>산학실전캡스톤 1 (1분반) <span>박영진 교수님</span></li>
            <li>전공진로설계 6 (120분반) <span>편기현 교수님</span></li>
          </ul>
        </div>
        <div className="Right_block">
          <div className="Class_block">
            <h2>클라우드컴퓨팅 (1분반)</h2>
            <div>
              11/15  12:00 ~ 13:00 강의 <span>완료</span>
            </div>
            <a href="#"> 출석 체크 하러 가기</a>
          </div>
          <div className="Log_block">
            <h3>이전 출석 로그</h3>
            <div className="">
              출석 10회 | 결석 1회
            </div>
            <ul className="Log_list">
              <ol>2023년 11월 1일 (수)    11:00 ~ 12:00   출석</ol>
            </ul>
          </div>
          <div className="NextClass_block">
            <h3>다음 수업 예정</h3>
            <span>14:00 ~ 15:00</span> <span>컴퓨터공학총론</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;