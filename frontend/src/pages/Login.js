import React, { useState } from 'react';
import '../styles/Login.css'
import {Link} from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e) => {
  e.preventDefault();
  
  // 콘솔 출력은 예시, 실제 로그인 수정 필요
  console.log(`로그인 시도 - 사용자명: ${username}, 비밀번호: ${password}`);
  };
  return(
    <div className="Login_block">
      <h1>프로젝트 제목이 뭔데요?</h1>
      <form onSubmit={handleLogin} className="Login_form">
        <label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <Link to ="/home" className="Login_button">
          <button type="submit">로그인</button>
        </Link>
      </form>
    </div>
  )
}

export default LoginPage;