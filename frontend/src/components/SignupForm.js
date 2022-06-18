import React, { useState } from "react";
import "../styles/SignupForm.css"
import axios from "axios";
import { formContext } from "../pages/LoginSignupPage";

function SignupForm() {
    const [isValidUserName, setIsValidUserName] = useState(true);
    const { setTab } = React.useContext(formContext);
    return (
        <div className="signupFormContainer">
            <h2>Đăng ký</h2>
            <div className="signupForm">
                <div className="signupData">
                    <p>Tên đăng nhập:</p> <input onInput={async (e) => {
                        await axios.get(`http://localhost:3008/api/checktendangnhap?tenDangNhap=${e.target.value.trim()}`).then(
                            res => {
                                if (res.data.hasUser == true) {
                                    setIsValidUserName(false);
                                    document.getElementById("error-username").innerHTML = "Tên đăng nhập đã tồn tại";
                                } else {
                                    setIsValidUserName(true);
                                    document.getElementById("error-username").innerHTML = "";
                                }
                            }
                        )
                    }} className="userName" type={"text"}></input>
                </div>
                <div id="error-username" style={{ color: "red", textAlign: "center" }}></div>
                <div className="signupData">
                    <p>Mật khẩu:</p> <input className="password" type={"password"}></input>
                </div>
                <div className="signupData">
                    <p>Xác nhận mật khẩu:</p> <input className="passwordConfirm" type={"password"}></input>
                </div>
                <div className="signupData">
                    <p>Họ tên:</p> <input className="name" type={"text"}></input>
                </div>
                <div className="signupData">
                    <p>Địa chỉ:</p> <input className="address" type={"text"}></input>
                </div>
                <div className="signupData">
                    <p>Số diện thoại:</p> <input className="tele" type={"tel"}></input>
                </div>
                <div className="signupData">
                    <p>Email:</p> <input className="email" type={"email"}></input>
                </div>
            </div>
            <button onClick={async () => {
                let userName = document.querySelector(".signupForm .userName").value.trim();
                let password = document.querySelector(".signupForm .password").value.trim();
                let passwordConfirm = document.querySelector(".signupForm .passwordConfirm").value.trim();
                let name = document.querySelector(".signupForm .name").value.trim();
                let address = document.querySelector(".signupForm .address").value.trim();
                let tele = document.querySelector(".signupForm .tele").value.trim();
                let email = document.querySelector(".signupForm .email").value.trim();
                if (password != passwordConfirm) {
                    alert('Mật khẩu xác nhận không đúng');
                } else {
                    if (userName == "" || password == "" || name == "" || address == "" || tele == "" || email == "") {
                        alert('Hãy nhập đầy đủ các trường');
                    } else {
                        if (isValidUserName == true) {
                            let link = `http://localhost:3008/api/themnguoidung?tenDangNhap=${userName}&matKhau=${password}` +
                                `&hoTen=${name}&soDienThoai=${tele}&diaChi=${address}&email=${email}`
                            await axios.post(link).then(
                                (res) => {
                                    console.log(res.data)
                                    let check = res.data.status;
                                    if (check) {
                                        alert('Đăng ký thàng công');
                                        setTab(1);
                                    }
                                }
                            )
                        }
                    }
                }

            }}>Đăng ký</button>
        </div>
    )
}

export default SignupForm;