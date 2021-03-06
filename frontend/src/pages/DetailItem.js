import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/DetailItem.css";
import { reactLocalStorage } from "reactjs-localstorage";
import { cartContext } from "../App";
function formatGiaTien(giaTien) {
    let giaTienAfter = "";
    let len = giaTien.length;
    for (let j = 1; j <= len; j++) {
        giaTienAfter = giaTien[len - j] + giaTienAfter;
        if (j % 3 == 0 && j != len) {
            giaTienAfter = "." + giaTienAfter;
        }
    }
    return giaTienAfter;
  }
function DetailItem() {
    const { addToCart } = React.useContext(cartContext);
    const location = useLocation();
    const [hoaHienThi, setHoaHienThi] = useState({});
    const [loaiHoaHienThi, setLoaiHoaHienThi] = useState({});
    let mahoaHienThi = 0;
    let maLoaiHoaHienThi = 0;
    if (location.state) {
        mahoaHienThi = location.state.maHoa;
        maLoaiHoaHienThi = location.state.maLoaiHoa;
    }
    window.scrollTo(0, 0);
    let navigate = useNavigate();

    const callAPIGetHoaByID = () => {
        axios.get("http://localhost:3008/api/gethoabyma?maHoa=" + mahoaHienThi).then(
            res => {
                console.log(res.data);
                setHoaHienThi(res.data.hoa);
                callAPIGetLoaiHoaByID();
            }
        );
    }
    const callAPIGetLoaiHoaByID = () => {
        axios.get("http://localhost:3008/api/getloaihoabyma?maLoaiHoa=" + maLoaiHoaHienThi).then(
            res => {
                console.log(res.data);
                setLoaiHoaHienThi(res.data.loaiHoa);
            }
        );
    }
    useEffect(() => {
        callAPIGetHoaByID()
    }, [mahoaHienThi])
    useEffect(() => {
        callAPIGetLoaiHoaByID()
    }, [maLoaiHoaHienThi])
    return (
        <div className="pageDetailItemContainer">
            <div className="detailItemContainer">
                <img src={hoaHienThi.hinhanh}></img>
                <div className="detailItem">
                    <h2>{hoaHienThi.tenhoa}</h2>
                    <h3>{formatGiaTien(String(hoaHienThi.giatien))} VN??</h3>
                    <p>{hoaHienThi.mota}</p>
                    <h4>C?? s???n: <em>{hoaHienThi.soluong}</em> h??ng</h4>
                    <h4>Danh m???c: <em>{loaiHoaHienThi.tenloaihoa}</em></h4>
                    <input id="soluongthemvao" type={"number"} min={1} defaultValue={1} max={hoaHienThi.soluong}></input> <button onClick={() => {
                        let cartSave = reactLocalStorage.get("cart");
                        let listItemInCart = [];
                        if (cartSave != undefined) {
                            listItemInCart = JSON.parse(cartSave);
                        }
                        let soLuongThemVao = document.querySelector("#soluongthemvao").value;
                        let soLuongTrongGio = 0;
                        let soLuongCoSan = hoaHienThi.soluong;
                        for (let i = 0; i < listItemInCart.length; i++) {
                            if (hoaHienThi.mahoa == listItemInCart[i].maHoa) {
                                soLuongTrongGio = listItemInCart[i].soLuong * 1;
                            }
                        }
                        if ((soLuongTrongGio * 1) + soLuongThemVao * 1 > soLuongCoSan * 1) {
                            alert("S??? l?????ng c?? s???n kh??ng ?????.");
                        } else {
                            addToCart({ maHoa: hoaHienThi.mahoa, soLuong: soLuongThemVao });
                            alert("Th??m v??o gi??? th??nh c??ng");
                        }
                    }}>Th??m v??o gi??? h??ng</button> <br />
                    <button onClick={() => { navigate(-1) }}>Quay l???i trang tr?????c</button>
                </div>
            </div>
        </div>
    )
}
export default DetailItem;