import React from "react";
import "../css/Login.css";
import axios from "axios";
const Login = () => {
  const signin = (e) => {
    e.preventDefault();
    const user = {
      userPhone: e.target.querySelector("#login").value,
      userPassword: e.target.querySelector("#password").value,
    };
    axios.post("http://localhost:5051/User/Login", user).then((res) => {
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        window.location.href = "/";
      } else {
        console.log("istifadeci tapilmadi");
      }
    });
  };
  return (
    <div className="login">
      <h1>PlantILL</h1>
      <img src="https://plantill.com/images/auth-im.png" />
      <div className="logincard">
        <form onSubmit={signin}>
          <h2>Xoş gəlmisiniz!</h2>
          <p>Giriş edin və suallarınızı bizə yönləndirin..</p>
          <div className="input-group">
            <label>Telefon</label>
            <input id="login" />
          </div>
          <div className="input-group">
            <label>Şifrə</label>
            <input
              id="password"
              type="password"
              placeholder="Parolu daxil edin..."
            />
          </div>
          <button>Daxil ol</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
