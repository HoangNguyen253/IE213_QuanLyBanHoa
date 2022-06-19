import React, { useEffect, useState } from "react";
import "../styles/MyDetailOrderPage.css"
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
const trangThaiDonHang = ["Vừa đặt", "Hủy đơn", "Đang giao", "Hoàn thành"];
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
function MyDetailOrderPage() {
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
    let dsDetailOrderHienThiComponent = listItem.map((detail, index) => {
        let sanPham = getDataSanPham(detail.maHoa);
        return (
            <tr>
                <td>{index + 1}</td>
                <td><img src={sanPham.hinhanh} /></td>
                <td>{sanPham.tenhoa}</td>
                <td>{formatGiaTien(String(sanPham.giatien))}</td>
                <td>{detail.soLuong}</td>
                <td>{formatGiaTien(String(detail.giaTien))}</td>
            </tr>
        );
    })
    return (
        <div className="myDetailOrderPageContainer">

            {(listItem.length>0) ? <div className="myDetailOrderPageMain">
                <h3>CHI TIẾT ĐƠN HÀNG</h3>
                <div className="myDetailOrderHeader">
                    <div>Mã đơn hàng: <b>{orderData.madonhang}</b></div>
                    <div>Khách hàng: <b>{orderData.tendangnhap}</b></div>
                    <div>Địa chỉ: <b>{orderData.diachi}</b></div>
                    <div>Thời gian đặt: <b>{orderData.thoigiandat}</b></div>
                    <div>Tổng tiền: <b>{formatGiaTien(String(orderData.tongtien))} VNĐ</b></div>
                    <div>Trạng thái: <b>{trangThaiDonHang[orderData.trangthai-1]}</b></div>

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
                            <th>Giá (VNĐ)</th>
                            <th>Số lượng</th>
                            <th>Tạm tính (VNĐ)</th>
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
                {/* <button onClick={updateDonHang}>Cập nhật đơn hàng</button> */}
            </div> : <div className="myDetailOrderPageContainer">
                <h3>CHI TIẾT ĐƠN HÀNG</h3><div className="noCartDiv"><Inventory2SharpIcon />Chưa có đơn hàng nào!</div> </div>}
        </div>
    )
}

export default MyDetailOrderPage;