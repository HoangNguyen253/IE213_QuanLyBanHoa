import React, {useState} from "react";
import "../styles/LoginForm.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';

function LoginForm() {
    const navigate = useNavigate();
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };
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
            <button onClick={async () => {
                let userName = document.querySelector(".loginForm input[type='text']").value.trim();
                let password = document.querySelector(".loginForm input[type='password']").value.trim();
                await axios.post(`http://localhost:3008/api/login?tenDangNhap=${userName}&matKhau=${password}`).then(
                    (res) => {
                        let check = res.data.success;
                        console.log(res.data);
                        if (check) {
                            reactLocalStorage.setObject('user', res.data.nguoiDung);
                            console.log(reactLocalStorage.getObject('user'));
                            window.location.replace('http://localhost:3000/');
                        }
                    }
                );
                //navigate('/');
                //let link = `http://localhost:3008/api/login?tenDangNhap=${userName}&matKhau=${password}`
            }}>Đăng nhập</button>
            <div onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave} style={{ color: isHovering ? "blue" : "rgb(0, 110, 255)", textDecoration: "underline", cursor: isHovering ? "pointer" : "" }}>Quên mật khẩu</div>
        </div>
    )
}

export default LoginForm;