import React from "react";
import { Link } from "react-router-dom";
import BannerImage from "../assets/Banner.jpg";
import Logo from "../assets/4Green.png";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home" style={{ backgroundImage: `url(${BannerImage})` }}>
      <div className="headerContainer">
        <img src={Logo} alt="Logo"></img>
        <p> Chuyên bán các loại hoa cảnh!</p>
        <Link to="/shop">
          <button> MUA NGAY </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
