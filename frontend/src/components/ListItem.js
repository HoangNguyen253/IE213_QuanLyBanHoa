import React from "react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { cartContext } from "../App";
function ListItem({ imgLink, tenHoa, giaTien, maHoa, maLoaiHoa }) {
  let navigate = useNavigate();
  const {addToCart} = React.useContext(cartContext);
  const callAPIGetHoaByID = (IDHoa) => {
    return new Promise((resolve, reject) => {
      axios.get("http://localhost:3008/api/gethoabyma?maHoa=" + IDHoa).then(
        res => {
          console.log(res.data);
          resolve(res.data);
        }
      );
    });
  }
  return (
    <div className="listItem" onClick={() => { navigate('/detailitem', { state: { maHoa: maHoa, maLoaiHoa: maLoaiHoa } }); }}>
      <div className="imgItem" style={{ backgroundImage: `url(${imgLink})` }}> </div>
      <h1> {tenHoa} </h1>
      <div className="priceAndCart">
        <p> {giaTien}đ</p>
        <ShoppingCartIcon onClick={(e) => {
          callAPIGetHoaByID(maHoa).then(function (hoa) {
            let cartSave = reactLocalStorage.get("cart");
            let listItemInCart = [];
            if (cartSave != undefined) {
              listItemInCart = JSON.parse(cartSave);
            }
            let soLuongTrongGio = 0;
            let soLuongCoSan = hoa.soluong;
            for (let i = 0; i < listItemInCart.length; i++) {
              if (hoa.mahoa == listItemInCart[i].maHoa) {
                soLuongTrongGio = listItemInCart[i].soLuong * 1;
              }
            }
            if ((soLuongTrongGio * 1) + 1 > soLuongCoSan * 1) {
              alert("Số lượng có sẵn không đủ.");
            } else {
              addToCart({maHoa: maHoa, soLuong: 1});
              alert("Thêm vào giỏ thành công");
            }
          });
          e.stopPropagation();
        }} />
      </div>
    </div>
  );
}

export default ListItem;
