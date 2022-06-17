import React from "react";
import "../styles/LoginForm.css";

function LoginForm() {
    return (
        <div className="loginFormContainer">
            <h2>Đăng nhập</h2>
            <div className="loginForm">
                <div className="loginData">
                    <p>Tên đăng nhập: </p> <input type={"text"}></input>
                </div>
                <div className="loginData">
                    <p>Mật khẩu: </p> <input type={"password"}></input>
                </div>
            </div>
            <button>Đăng nhập</button>
        </div>
    )
}

export default LoginForm;