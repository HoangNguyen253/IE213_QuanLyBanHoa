import React, {useState} from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/4Green.png";
import "../styles/Navbar.css";
import ReorderIcon from '@mui/icons-material/Reorder';

function Navbar() {
    const [openLinks, setOpenLinks] = useState(false);

    const toggleNavbar = () => {
      setOpenLinks(!openLinks);
    };
    return (
        <div className="navbar">
            <div className="leftSide" id={openLinks ? "open" : "close"}>
            <img src={Logo} alt="Logo"></img>
                <div className="hiddenLinks">
                    <Link to="/"> Trang chủ </Link>
                    <Link to="/shop" state={{maLoaiHoa: '', page: 0, tenHoa: ''}}> Cửa hàng </Link>
                    <Link to="/addproduct"> Thêm mới </Link>
                    <Link to="/manageproduct"> Quản lý hoa </Link>
                    <Link to="/cart"> Giỏ hàng </Link>
                    <Link to="/loginsignup"> Đăng nhập/ Đăng ký </Link>
                </div>
            </div>
            <div className="rightSide">
                <Link to="/"> Trang chủ </Link>
                <Link to="/shop" state={{maLoaiHoa: '', page: 0, tenHoa: ''}}> Cửa hàng </Link>
                <Link to="/addproduct"> Thêm mới </Link>
                <Link to="/manageproduct"> Quản lý hoa </Link>
                <Link to="/cart"> Giỏ hàng </Link>
                <Link to="/loginsignup"> Đăng nhập/ Đăng ký </Link>
                <button onClick={toggleNavbar}>
                    <ReorderIcon />
                </button>
            </div>
        </div>
    )
}
export default Navbar;