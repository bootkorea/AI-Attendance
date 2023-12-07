import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username === "" || username === undefined) {
      alert("아이디를 입력하세요");
      return false;
    }
    if (password === "" || password === undefined) {
      alert("패스워드를 입력하세요");
      return false;
    }

    console.log(
      "LoginForm:window.sessionStorage(login_id) =>",
      window.sessionStorage.getItem("id")
    );

    axios
      .post("http://localhost:12000/login", {
        u_id: username,
        u_pw: password,
      })
      .then((res) => {
        console.log("handleLogin =>", res);
        if (res.data[0].cnt === 1) {
          navigate("/Home");
        } else {
          alert("아이디, 패스워드가 정확하지 않습니다.");
          username = "";
          password = "";
          navigate("/");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="Login_block">
      <h1>프로젝트 제목이 뭔데요?</h1>
      <form onSubmit={handleLogin} className="Login_form">
        <label>
          <input
            type="text"
            placeholder="학번"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <Link to="/home" className="Login_button">
          <button type="submit">로그인</button>
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
