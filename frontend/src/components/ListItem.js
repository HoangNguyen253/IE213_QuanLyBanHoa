import React from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate, Navigate } from "react-router-dom";
import { dsHoa } from "../data/dsHoa";

function ListItem({ imgLink, tenHoa, giaTien, maHoa, maLoaiHoa }) {
  let navigate = useNavigate();
  return (
    <div className="listItem" onClick={() => {navigate('/detailitem', {state: {maHoa: maHoa, maLoaiHoa: maLoaiHoa}});}}>
      <div className="imgItem" style={{ backgroundImage: `url(${imgLink})` }}> </div>
      <h1> {tenHoa} </h1>
      <div className="priceAndCart">
        <p> {giaTien}đ</p>
        <ShoppingCartIcon onClick={(e) => {alert("Click"); e.stopPropagation();}} />
      </div>
    </div>
  );
}

export default ListItem;
