import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [userInfo, setuserInfo] = useState({
    u_id: "",
    u_pw: "",
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from submitting

    const apiUrl = "http://localhost:12000/api/login";
    const { username, password } = userInfo;

    if (username === "" || username === undefined) {
      alert("아이디를 입력하세요");
      return false;
    }
    if (password === "" || password === undefined) {
      alert("패스워드를 입력하세요");
      return false;
    }

    try {
      const res = await axios.post(apiUrl, {
        u_id: username,
        u_pw: password,
      });

      if (res.data.success === 1) {
        alert("안녕하세요, 교수님.");
        navigate("/Admin", {
          state: {
            user_number: username,
          },
        });
      } else if (res.data.success === 2) {
        alert("안녕하세요, 노예.");
        navigate("/Home", {
          state: {
            user_number: username,
          },
        });
      } else if (res.data.success === 3) {
        alert("안녕하세요, 주인님.");
        navigate("/Admin", {
          state: {
            user_number: username,
          },
        });
      } else {
        alert("잘못된 아이디 혹은 비밀번호 사용");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setuserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  return (
    <div className="Login_block">
      <h1>예성아, 출석을 부탁해!</h1>
      <form onSubmit={handleLogin} className="Login_form">
        <label>
          <input
            type="text"
            name="username"
            placeholder="학번"
            className="Input_button"
            value={userInfo.username}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            className="Input_button"
            value={userInfo.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <div to="/home" className="Login_button">
          <button type="submit">로그인</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
