import React from "react";
import "../styles/SignupForm.css"

function SignupForm() {
    return (
        <div className="signupFormContainer">
            <h2>Đăng ký</h2>
            <div className="signupForm">
                <div className="signupData">
                    <p>Tên đăng nhập:</p> <input type={"text"}></input>
                </div>
                <div className="signupData">
                    <p>Mật khẩu:</p> <input type={"password"}></input>
                </div>
                <div className="signupData">
                    <p>Xác nhận mật khẩu:</p> <input type={"password"}></input>
                </div>
                <div className="signupData">
                    <p>Họ tên:</p> <input type={"text"}></input>
                </div>
                <div className="signupData">
                    <p>Địa chỉ:</p> <input type={"text"}></input>
                </div>
                <div className="signupData">
                    <p>Số diện thoại:</p> <input type={"tel"}></input>
                </div>
                <div className="signupData">
                    <p>Email:</p> <input type={"email"}></input>
                </div>
            </div>
            <button>Đăng ký</button>
        </div>
    )
}

export default SignupForm;