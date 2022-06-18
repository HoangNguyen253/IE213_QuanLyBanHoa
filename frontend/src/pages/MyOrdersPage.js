import React, { useEffect, useState } from "react";
import "../styles/MyOrdersPage.css"
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
const trangThaiDonHang = ["Vừa đặt", "Hủy đơn", "Đang giao", "Hoàn thành"]
function ListOrder() {
    // const location = useLocation();
    // const [totalOrders, setTotalOrders] = useState(0);
    // const [ordersPerPage, setOrdersPerPage] = useState(0);
    // const [dsOrder, setOrderList] = useState([]);
    // let pageOn = 0;
    // if (location.state) {
    //     pageOn = location.state.page;
    // }
    // const callAPIGetOrderList = () => {
    //     axios.get("http://localhost:3008/api/quanlydonhang?donhangPerPage=6&page=" + pageOn).then(
    //         res => {
    //             console.log(res.data);
    //             setTotalOrders(res.data.total_results);
    //             setOrderList(res.data.donHangList);
    //             setOrdersPerPage(res.data.entries_per_page);
    //         }
    //     );
    // }
    // useEffect(() => {
    //     callAPIGetOrderList();
    // }, [pageOn]);
    // let paginationComponent = [];
    // for (let i = 1; i <= Math.ceil(totalOrders * 1.0 / ordersPerPage); i++) {
    //     if (pageOn + 1 == i)
    //         paginationComponent.push(<Link key={i} to="/listorder" state={{ page: i - 1 }} className="active">{i}</Link>)
    //     else
    //         paginationComponent.push(<Link key={i} to="/listorder" state={{ page: i - 1 }}>{i}</Link>)
    // }
    // let dsOrderHienThiComponent = dsOrder.map((order) => {
    //     return (
    //         <tr>
    //             <td>{order.madonhang}</td>
    //             <td>{order.tendangnhap}</td>
    //             <td>{order.diachi}</td>
    //             <td>{order.tongtien}đ</td>
    //             <td>{order.thoigiandat}</td>
    //             <Link to="/detailorder" state={{maDonHang: order.madonhang}}><td>{trangThaiDonHang[order.trangthai-1]}</td> </Link>
    //         </tr>
    //     );
    // })
    return (
        <div className="myOrdersPageContainer">

            {(true) ? <div className="myOrdersPageMain">
                <h3>Danh sách đơn hàng của bạn</h3>
                <table>
                    <colgroup>
                        <col span={1} width="14%"></col>
                        <col span={1} width="18%"></col>
                        <col span={1} width="18%"></col>
                        <col span={1} width="18%"></col>
                        <col span={1} width="18%"></col>
                        <col span={1} width="14%"></col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Mã đơn hàng</th>
                            <th>Địa chỉ</th>
                            <th>Tổng tiền</th>
                            <th>Thời gian đặt</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>1</td>
                            <td>Địa chỉ A</td>
                            <td>1000000đ</td>
                            <td>10-10-2022</td>
                            <td>Đã đặt</td>
                        </tr>
                        {/* {dsOrderHienThiComponent} */}
                    </tbody>
                </table>
                <div className="pagination">
                    <a href="#">&laquo;</a>
                    {/* {paginationComponent} */}
                    <a href="#">&raquo;</a>
                </div>
            </div> : <div className="myOrdersPageContainer">
            <h3>Danh sách đơn hàng</h3><div className="noCartDiv"><Inventory2SharpIcon />Chưa có đơn hàng nào!</div> </div>}
        </div>
    )
}

export default ListOrder;