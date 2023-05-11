import InputMask from "react-input-mask";
import "../css/Login.css";
import axios from "axios";
import { useState } from "react";
const Login = () => {
  const [type, setType] = useState("login");
  const signin = (e) => {
    e.preventDefault();
    if (type === "login") {
      const user = {
        userPhone: e.target
          .querySelector("#login")
          .value.replaceAll("(", "")
          .replaceAll(" ", "")
          .replaceAll(")", "")
          .replaceAll("-", ""),
        userPassword: e.target.querySelector("#password").value,
      };
      axios.post("https://nurlanshukur.com/User/Login", user).then((res) => {
        localStorage.setItem("auth", JSON.stringify(res.data));
        window.location.href = "/";
      });
    } else {
      const user = {
        userPhone: e.target
          .querySelector("#reglogin")
          .value.replaceAll("(", "")
          .replaceAll(" ", "")
          .replaceAll(")", "")
          .replaceAll("-", ""),
        userPassword: e.target.querySelector("#regpassword").value,
        userName: e.target.querySelector("#name").value,
        userSurname: e.target.querySelector("#surname").value,
        userEmail: e.target.querySelector("#email").value,
        userCityId : 1,
        userStatusId : 3
      };
      axios
        .post("https://nurlanshukur.com/User/Registration", user)
        .then((res) => {
          alert("Qeydiyyat uğurla tamamlandı")
          setType("login")
        })
        .catch((res) => {
          alert(res.response.data)
        });
    }
  };
  return (
    <div className="login">
      <h1>PlantILL</h1>
      <img src="https://plantill.com/images/auth-im.png" />
      <div className="logincard">
        <form onSubmit={signin}>
          <h2>Xoş gəlmisiniz!</h2>
          {type === "login" ? (
            <>
              <p>Giriş edin və suallarınızı bizə yönləndirin..</p>
              <div className="input-group">
                <label>Telefon</label>
                <InputMask
                  mask="+(999) (99) 999-99-99"
                  placeholder="+994 (55) 555-55-55"
                  defaultValue=""
                  id="login"
                />
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
              <p>
                Hesabınız yoxdur? indi
                <span onClick={() => setType("signup")}> qeydiyyatdan </span>
                keçin.
              </p>
            </>
          ) : (
            <>
              <p>Qeydiyyatdan keçin və suallarınızı bizə yönləndirin..</p>
              <div className="input-group">
                <label>Ad</label>
                <input id="name" type="text" placeholder="Adınız..." />
              </div>
              <div className="input-group">
                <label>Soyad</label>
                <input id="surname" type="text" placeholder="Soyadınız..." />
              </div>
              <div className="input-group">
                <label>E-mail</label>
                <input id="email" type="mail" placeholder="Mail ünvanınız..." />
              </div>
              <div className="input-group">
                <label>Telefon</label>
                <InputMask
                  mask="+(999) (99) 999-99-99"
                  placeholder="+994 (55) 555-55-55"
                  defaultValue=""
                  id="reglogin"
                />
              </div>
              <div className="input-group">
                <label>Şifrə</label>
                <input
                  id="regpassword"
                  type="password"
                  placeholder="Şifrəni daxil edin..."
                />
              </div>
              <div className="input-group">
                <label>Şifrənin təkrarı</label>
                <input
                  id="repassword"
                  type="password"
                  placeholder="Şifrəni daxil edin..."
                />
              </div>
              <button>Qeydiyyatdan keç</button>
              <p>
                Hesabınız var?
                <span onClick={() => setType("login")}> Daxil olun</span>.
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
