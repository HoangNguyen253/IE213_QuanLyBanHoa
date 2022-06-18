import React, { useEffect, useState } from "react";
import "../styles/CartPage.css"
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { Link } from "react-router-dom";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import $ from "jquery";
function CartPage() {
    const [listItem, setListItem] = useState([]);
    const [renderCart, setRenderCart] = useState(null);
    const [tongTien, setTongTien] = useState(0);
    const [address, setAddress] = useState("");
    function getHoaAllAPI() {
        return new Promise((resolve, reject) => {
            axios.get("http://localhost:3008/api/hoaall").then(
                res => {
                    console.log(res.data.hoas);
                    resolve(res.data.hoas);
                }
            );
        });
    }
    function tinhTongTien() {
        let listTR = document.querySelectorAll(".cartPageContainer tbody tr.itemInCart");

        let tongNew = 0;
        listTR.forEach(tr => {
            let soLuong = tr.querySelector("input").value;
            let giaTien = tr.querySelector("td.giaTien span").innerHTML;
            tongNew += soLuong * giaTien;
        });
        setTongTien(tongNew);
    }
    function getAddress() {
        let user = reactLocalStorage.getObject("user");
        if(Object.keys(user).length) {
            setAddress(user.diachi);
        }
    }
    useEffect(() => {
        getAddress();
        getHoaAllAPI().then(function (listHoa) {
            let cartSave = reactLocalStorage.get("cart");
            let listItemInCart = [];
            if (cartSave != undefined) {
                listItemInCart = JSON.parse(cartSave);
            }
            let listMerge = [];
            let tong = 0;
            console.log(listHoa);
            console.log(listItemInCart);
            for (let i = 0; i < listItemInCart.length; i++) {
                let obj;
                for (let j = 0; j < listHoa.length; j++) {
                    if (listItemInCart[i].maHoa * 1 == listHoa[j].mahoa * 1) {
                        obj = {
                            maHoa: listHoa[j].mahoa,
                            tenHoa: listHoa[j].tenhoa,
                            imgLink: listHoa[j].hinhanh,
                            giaTien: listHoa[j].giatien,
                            soLuongMax: listHoa[j].soluong,
                            maLoaiHoa: listHoa[j].maloaihoa,
                            moTa: listHoa[j].moTa,
                            soLuong: listItemInCart[i].soLuong
                        }
                    }
                }
                listMerge.push(obj);
                tong += obj.giaTien * obj.soLuong;
            }
            setTongTien(tong);
            setListItem(listMerge);
        })
    }, []);
    useEffect(() => {
        setRenderCart(listItem.map(item => (
            <tr key={item.maHoa} className="itemInCart" mahoa={item.maHoa}>
                <td><DeleteSharpIcon onClick={() => {
                    console.log(listItem);
                    setListItem(listItem.filter((x) => x.maHoa !== item.maHoa));
                }} /></td>
                <td><img src={item.imgLink} /></td>
                <td><Link to="/detailitem" state={{ maHoa: item.maHoa, maLoaiHoa: item.maLoaiHoa }}>{item.tenHoa}</Link></td>
                <td className="giaTien"><span>{item.giaTien}</span>đ</td>
                <td><input onInput={(e) => {
                    tinhTongTien();
                    let tr =e.target.parentElement.parentElement;
                    tr.querySelector("td.giaTienPerTR span").innerHTML = item.giaTien * e.target.value;
                }} type={"number"} min={1} defaultValue={item.soLuong} max={item.soLuongMax} /></td>
                <td className="giaTienPerTR"><span>{item.giaTien * item.soLuong}</span> đ</td>
            </tr>
        )));
    }, [listItem]);
    useEffect(() => {
        tinhTongTien();
    }, [renderCart])
    return (
        <div className="cartPageContainer">

            {(listItem.length > 0) ? <div className="cartPageMain">
                <h3>Giỏ hàng</h3><table>
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
                        {renderCart}
                        <tr>
                            <td colSpan={4} style={{ textAlign: "left" }}><button onClick={() => {
                                let listTR = document.querySelectorAll(".cartPageContainer tbody tr.itemInCart");

                                let listCartNew = [];
                                listTR.forEach(tr => {
                                    let maHoa = tr.getAttribute("mahoa");
                                    let soLuong = tr.querySelector("input").value;

                                    let obj = {
                                        maHoa: maHoa,
                                        soLuong: soLuong
                                    };
                                    listCartNew.push(obj);
                                });
                                if (listCartNew.length == 0) {
                                    reactLocalStorage.remove("cart");
                                } else {
                                    reactLocalStorage.set("cart", JSON.stringify(listCartNew));
                                    alert("Cập nhật giỏ hàng thành công");
                                }
                            }}>Cập nhật giỏ hàng</button></td>
                            <td><b>Tổng cộng</b></td>
                            <td><b>{tongTien}đ</b></td>
                        </tr>
                    </tbody>
                </table>
                <div className="inputAddressField">
                    <div>
                        <p>Địa chỉ nhận hàng: </p> <input id="diachigiaohang" type={"text"} defaultValue={address}/>
                    </div>
                    <button onClick={async () => {
                        let user = reactLocalStorage.getObject("user");
                        if (Object.keys(user).length) {
                            let diaChiGiaoHang = document.getElementById("diachigiaohang").value.trim();
                            if (diaChiGiaoHang == "") {
                                alert("Vui lòng nhập địa chỉ trước khi đặt hàng");
                            } else {
                                if (window.confirm("Xác nhận đặt hàng") == true) {
                                    let listTR = document.querySelectorAll(".cartPageContainer tbody tr.itemInCart");

                                    let ctdh = [];
                                    listTR.forEach(tr => {
                                        let maHoa = tr.getAttribute("mahoa");
                                        let soLuong = tr.querySelector("input").value;
                                        let giaTien = tr.querySelector("td.giaTienPerTR span").innerHTML*1;
                                        console.log(giaTien);
                                        let obj = {
                                            maHoa: maHoa*1,
                                            soLuong: soLuong*1,
                                            giaTien: giaTien*1
                                        };
                                        ctdh.push(obj);
                                    });

                                    let donHang = {
                                        tenDangNhap: user.tendangnhap,
                                        email: user.email,
                                        diaChi: diaChiGiaoHang,
                                        tongTien: tongTien,
                                        ctdh: ctdh
                                    };
                                    await axios.post("http://localhost:3008/api/thanhtoan", JSON.stringify(donHang), {
                                        headers: {
                                            'Content-type': "application/json"
                                        }
                                    }).then(res=>{
                                        if (res.data.status == true) {
                                            alert("Đặt hàng thành công");
                                            reactLocalStorage.remove("cart");
                                            window.location.replace("http://localhost:3000");
                                        } else {
                                            alert("Đặt hàng thất bại: " + res.data.error);
                                        }
                                    });
                                }
                            }
                        } else {
                            alert("Vui lòng đăng nhập trước khi đặt hàng");
                        }
                    }}>Đặt hàng</button>
                </div> </div> : <div className="cartPageMain">
                <h3>Giỏ hàng</h3><div className="noCartDiv"><Inventory2SharpIcon />Chưa có đơn hàng nào!</div> </div>}
        </div>
    )
}

export default CartPage;