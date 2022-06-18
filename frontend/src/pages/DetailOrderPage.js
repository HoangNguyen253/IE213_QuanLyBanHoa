import React, { useEffect, useState } from "react";
import "../styles/DetailOrderPage.css"
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
const trangThaiDonHang = ["Vừa đặt", "Hủy đơn", "Đang giao", "Hoàn thành"]
function DetailOrder() {
    const location = useLocation();
    const [orderData, setOrder] = useState({});
    const [dsHoa, setHoaList] = useState([]);
    const [listItem, setListItem] = useState([]);
    let maDonHang = 0;
    if (location.state) {
        maDonHang = location.state.maDonHang;
    }
    const callAPIGetHoaList = () => {
        return new Promise(function (myResolve) {
            axios.get("http://localhost:3008/api/hoaall").then(
                res => {
                    console.log(res.data);
                    setHoaList(res.data.hoas);
                    myResolve('');
                }
            );
        })
    }
    const callAPIGetDetailOrder = () => {
        axios.get("http://localhost:3008/api/chitietdonhang?maDonHang=" + maDonHang).then(
            res => {
                console.log(res.data);
                setOrder(res.data.donHang);
                setListItem(res.data.donHang.ctdh);
            }
        );
    }
    useEffect(() => {
        callAPIGetHoaList().then(function (value) {
            callAPIGetDetailOrder();
        })
    }, [maDonHang]);
    function getDataSanPham(maHoa) {
        return dsHoa.find(element => { return element.mahoa == maHoa })
    }
    function updateDonHang() {
        axios.post("http://localhost:3008/api/suadonhang?maDonHang=" + maDonHang+"&trangThai=" + orderData.trangthai).then(
            res => {
                console.log(res.data);
                (res.data.status) ? alert("Cập nhật trạng thái đơn hàng thành công!") : alert("Cập nhật trạng thái đơn hàng thất bại!")
            }
        );
    }
    let dsDetailOrderHienThiComponent = listItem.map((detail, index) => {
        let sanPham = getDataSanPham(detail.maHoa);
        return (
            <tr>
                <td>{index + 1}</td>
                <td><img src={sanPham.hinhanh} /></td>
                <td>{sanPham.tenhoa}</td>
                <td>{sanPham.giatien}đ</td>
                <td>{detail.soLuong}</td>
                <td>{detail.giaTien}đ</td>
            </tr>
        );
    })
    let trangThaiDonHangComponent = trangThaiDonHang.map((tt, index) => {
        return (
            <option value={index + 1}>{tt}</option>
        )
    })
    return (
        <div className="detailOrderPageContainer">

            {(listItem.length>0) ? <div className="detailOrderPageMain">
                <h3>CHI TIẾT ĐƠN HÀNG</h3>
                <div className="detailOrderHeader">
                    <div>Mã đơn hàng: <b>{orderData.madonhang}</b></div>
                    <div>Khách hàng: <b>{orderData.tendangnhap}</b></div>
                    <div>Địa chỉ: <b>{orderData.diachi}</b></div>
                    <div>Thời gian đặt: <b>{orderData.thoigiandat}</b></div>
                    <div>Tổng tiền: <b>{orderData.tongtien}đ</b></div>
                    <div>Trạng thái: <select value={orderData.trangthai} onChange={(e) => setOrder(preState => ({ ...preState, trangthai: e.target.value }))}>
                        {trangThaiDonHangComponent}
                    </select></div>

                </div>
                <table>
                    <colgroup>
                        <col span={1} width="10%"></col>
                        <col span={1} width="18%"></col>
                        <col span={1} width="18%"></col>
                        <col span={1} width="18%"></col>
                        <col span={1} width="18%"></col>
                        <col span={1} width="18%"></col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Tạm tính</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td>1</td>
                            <td>Khách hàng A</td>
                            <td>Địa chỉ A</td>
                            <td>1000000đ</td>
                            <td>10-10-2022</td>
                            <td>Đã đặt</td>
                        </tr> */}
                        {dsDetailOrderHienThiComponent}
                    </tbody>
                </table>
                <button onClick={updateDonHang}>Cập nhật đơn hàng</button>
            </div> : <div className="detailOrderPageContainer">
                <h3>CHI TIẾT ĐƠN HÀNG</h3><div className="noCartDiv"><Inventory2SharpIcon />Chưa có đơn hàng nào!</div> </div>}
        </div>
    )
}

export default DetailOrder;