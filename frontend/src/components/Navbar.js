import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/4Green.png";
import "../styles/Navbar.css";
import ReorderIcon from '@mui/icons-material/Reorder';
import axios from "axios";
import { reactLocalStorage } from 'reactjs-localstorage';

function Navbar() {
    const [openLinks, setOpenLinks] = useState(false);
    const [userLogin, setUser] = useState(null);
    function getUserInLocal() {
        let userSave = reactLocalStorage.getObject('user');
        console.log(userLogin, " ", userSave);
        if (Object.keys(userSave).length) {
            if (userLogin) {
                if(!(userLogin.tendangnhap == userSave.tendangnhap
                ||  userLogin.matkhau == userSave.matkhau)) {
                    setUser(reactLocalStorage.getObject('user'));
                }
            } else{
                setUser(reactLocalStorage.getObject('user'));
            }
        }
    }
    useEffect(() => {
        getUserInLocal();
    });
    const toggleNavbar = () => {
        setOpenLinks(!openLinks);
    };
    return (
        <div className="navbar">
            <div className="leftSide" id={openLinks ? "open" : "close"}>
                <img src={Logo} alt="Logo"></img>
                <div className="hiddenLinks">
                    <Link to="/"> Trang chủ </Link>
                    <Link to="/shop" state={{ maLoaiHoa: '', page: 0, tenHoa: '' }}> Cửa hàng </Link>
                    <Link to="/addproduct"> Thêm mới </Link>
                    <Link to="/manageproduct"> Quản lý hoa </Link>
                    <Link to="/listorder" state={{page: 0}}> Quản lý đơn hàng </Link>
                    <Link to="/myorders" state={{page: 0}}> Đơn hàng của tôi </Link>
                    <Link to="/cart"> Giỏ hàng </Link>
                    {(userLogin) ? (<a onClick={() => {
                        reactLocalStorage.remove('user');
                        setUser(null);
                    }}>Đăng xuất: {userLogin.hoten}</a>) : <Link to="/loginsignup"> Đăng nhập/ Đăng ký </Link>}
                </div>
            </div>
            <div className="rightSide">
                <Link to="/"> Trang chủ </Link>
                <Link to="/shop" state={{ maLoaiHoa: '', page: 0, tenHoa: '' }}> Cửa hàng </Link>
                <Link to="/addproduct"> Thêm mới </Link>
                <Link to="/manageproduct"> Quản lý hoa </Link>
                <Link to="/listorder" state={{page: 0}}> Quản lý đơn hàng</Link>
                <Link to="/myorders" state={{page: 0}}> Đơn hàng của tôi</Link>
                <Link to="/cart"> Giỏ hàng </Link>
                {(userLogin) ? (<a onClick={() => {
                    reactLocalStorage.remove('user');
                    setUser(null);
                }}>Đăng xuất: {userLogin.hoten}</a>) : <Link to="/loginsignup"> Đăng nhập/ Đăng ký </Link>}
                <button onClick={toggleNavbar}>
                    <ReorderIcon />
                </button>
            </div>
        </div>
    )
}
export default Navbar;