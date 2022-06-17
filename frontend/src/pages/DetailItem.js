import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/DetailItem.css";

function DetailItem() {
    const location = useLocation();
    const [hoaHienThi, setHoaHienThi] = useState({});
    const [loaiHoaHienThi, setLoaiHoaHienThi] = useState({});
    let mahoaHienThi = 0;
    let maLoaiHoaHienThi = 0;
    if (location.state){
        mahoaHienThi = location.state.maHoa;
        maLoaiHoaHienThi = location.state.maLoaiHoa;
    }
    window.scrollTo(0, 0);
    let navigate = useNavigate();

    const callAPIGetHoaByID = () => {
        axios.get("http://localhost:3008/api/gethoabyma?maHoa="+ mahoaHienThi).then(
            res => {
                console.log(res.data);
                setHoaHienThi(res.data.hoa);
                callAPIGetLoaiHoaByID();
            }
        );
    }
    const callAPIGetLoaiHoaByID = () => {
        axios.get("http://localhost:3008/api/getloaihoabyma?maLoaiHoa="+ maLoaiHoaHienThi).then(
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
                    <h3>{hoaHienThi.giatien} đ</h3>
                    <p>{hoaHienThi.mota}</p>
                    <h4>Có sẵn: <em>{hoaHienThi.soluong}</em> hàng</h4>
                    <h4>Danh mục: <em>{loaiHoaHienThi.tenloaihoa}</em></h4>
                    <input type={"number"} min={1} defaultValue={1}></input> <button>Thêm vào giỏ hàng</button> <br/>
                    <button onClick={() => {navigate(-1)}}>Quay lại trang trước</button>
                </div>
            </div>
        </div>
    )
}
export default DetailItem;