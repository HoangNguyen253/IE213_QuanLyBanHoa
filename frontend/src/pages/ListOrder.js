import React, { useEffect, useState } from "react";
import "../styles/ListOrderPage.css"
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
const trangThaiDonHang = ["Vừa đặt", "Hủy đơn", "Đang giao", "Hoàn thành"]
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
function ListOrder() {
    const location = useLocation();
    const [totalOrders, setTotalOrders] = useState(0);
    const [ordersPerPage, setOrdersPerPage] = useState(0);
    const [dsOrder, setOrderList] = useState([]);
    let pageOn = 0;
    if (location.state) {
        pageOn = location.state.page;
    }
    const callAPIGetOrderList = () => {
        axios.get("http://localhost:3008/api/quanlydonhang?donhangPerPage=6&page=" + pageOn).then(
            res => {
                console.log(res.data);
                setTotalOrders(res.data.total_results);
                setOrderList(res.data.donHangList);
                setOrdersPerPage(res.data.entries_per_page);
            }
        );
    }
    useEffect(() => {
        callAPIGetOrderList();
    }, [pageOn]);
    let paginationComponent = [];
    for (let i = 1; i <= Math.ceil(totalOrders * 1.0 / ordersPerPage); i++) {
        if (pageOn + 1 == i)
            paginationComponent.push(<Link key={i} to="/listorder" state={{ page: i - 1 }} className="active">{i}</Link>)
        else
            paginationComponent.push(<Link key={i} to="/listorder" state={{ page: i - 1 }}>{i}</Link>)
    }
    let dsOrderHienThiComponent = dsOrder.map((order) => {
        return (
            <tr>
                <td>{order.madonhang}</td>
                <td>{order.tendangnhap}</td>
                <td>{order.diachi}</td>
                <td>{formatGiaTien(String(order.tongtien))}</td>
                <td>{order.thoigiandat}</td>
                <Link to="/detailorder" state={{maDonHang: order.madonhang}}><td>{trangThaiDonHang[order.trangthai-1]}</td> </Link>
            </tr>
        );
    })
    // const [listItem, setListItem] = useState(sampleData);
    // const [renderCart, setRenderCart] = useState(null);
    // function getItemByID(id) {
    //     return dsHoa.find(element => { return element.maHoa == id })
    // }
    // useEffect(() => {
    //     setRenderCart(listItem.map(item => (
    //         <tr>
    //             <td><DeleteSharpIcon onClick={async () => { sampleData = await listItem.filter((x) => x.maHoa !== item.maHoa); setListItem(sampleData); }} /></td>
    //             <td><img src={item.imgLink} /></td>
    //             <td><Link to="/detailitem" state={{ hoa: getItemByID(item.maHoa) }}>Hoa đẹp</Link></td>
    //             <td>{item.giaTien}đ</td>
    //             <td><input type={"number"} min={1} defaultValue={1} /></td>
    //             <td>{item.giaTien}đ</td>
    //         </tr>
    //     )));
    // }, [listItem]);
    // // let renderCart =listItem.map(item => (
    // //             <tr>
    // //                 <td><DeleteSharpIcon onClick={async () => {sampleData = await listItem.filter((x) => x.maHoa !== item.maHoa); console.log(sampleData); setListItem(sampleData);  }} /></td>
    // //                 <td><img src={item.imgLink} /></td>
    // //                 <td><Link to="/detailitem" state={{ hoa: getItemByID(item.maHoa) }}>Hoa đẹp</Link></td>
    // //                 <td>{item.giaTien}đ</td>
    // //                 <td><input type={"number"} min={1} defaultValue={1} /></td>
    // //                 <td>{item.giaTien}đ</td>
    // //             </tr>
    // //         ));
    return (
        <div className="listOrderPageContainer">

            {(dsOrder.length > 0) ? <div className="listOrderPageMain">
                <h3>Danh sách đơn hàng</h3>
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
                            <th>Mã đơn hàng</th>
                            <th>Khách hàng</th>
                            <th>Địa chỉ</th>
                            <th>Tổng tiền (VNĐ)</th>
                            <th>Thời gian đặt</th>
                            <th>Trạng thái</th>
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
                        {dsOrderHienThiComponent}
                    </tbody>
                </table>
                <div className="pagination">
                    {/* <a href="#">&laquo;</a> */}
                    {paginationComponent}
                    {/* <a href="#">&raquo;</a> */}
                </div>
            </div> : <div className="listOrderPageContainer">
            <h3>Danh sách đơn hàng</h3><div className="noCartDiv"><Inventory2SharpIcon />Chưa có đơn hàng nào!</div> </div>}
        </div>
    )
}

export default ListOrder;