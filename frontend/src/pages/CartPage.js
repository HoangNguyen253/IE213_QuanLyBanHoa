import React, { useEffect, useState } from "react";
import "../styles/CartPage.css"
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { Link } from "react-router-dom";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
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
                <td className="giaTien"><span>{item.giaTien}</span>??</td>
                <td><input onInput={(e) => {
                    tinhTongTien();
                    let tr =e.target.parentElement.parentElement;
                    tr.querySelector("td.giaTienPerTR span").innerHTML = item.giaTien * e.target.value;
                }} type={"number"} min={1} defaultValue={item.soLuong} max={item.soLuongMax} /></td>
                <td className="giaTienPerTR"><span>{item.giaTien * item.soLuong}</span> ??</td>
            </tr>
        )));
    }, [listItem]);
    useEffect(() => {
        tinhTongTien();
    }, [renderCart])
    return (
        <div className="cartPageContainer">

            {(listItem.length > 0) ? <div className="cartPageMain">
                <h3>Gi??? h??ng</h3><table>
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
                            <th>S???n ph???m</th>
                            <th>Gi??</th>
                            <th>S??? l?????ng</th>
                            <th>T???m t??nh</th>
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
                                    alert("C???p nh???t gi??? h??ng th??nh c??ng");
                                }
                            }}>C???p nh???t gi??? h??ng</button></td>
                            <td><b>T???ng c???ng</b></td>
                            <td><b>{tongTien}??</b></td>
                        </tr>
                    </tbody>
                </table>
                <div className="inputAddressField">
                    <div>
                        <p>?????a ch??? nh???n h??ng: </p> <input id="diachigiaohang" type={"text"} defaultValue={address}/>
                    </div>
                    <button onClick={async () => {
                        let user = reactLocalStorage.getObject("user");
                        if (Object.keys(user).length) {
                            let diaChiGiaoHang = document.getElementById("diachigiaohang").value.trim();
                            if (diaChiGiaoHang == "") {
                                alert("Vui l??ng nh???p ?????a ch??? tr?????c khi ?????t h??ng");
                            } else {
                                if (window.confirm("X??c nh???n ?????t h??ng") == true) {
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
                                            alert("?????t h??ng th??nh c??ng");
                                            reactLocalStorage.remove("cart");
                                            window.location.replace("http://localhost:3000");
                                        } else {
                                            alert("?????t h??ng th???t b???i: " + res.data.error);
                                        }
                                    });
                                }
                            }
                        } else {
                            alert("Vui l??ng ????ng nh???p tr?????c khi ?????t h??ng");
                        }
                    }}>?????t h??ng</button>
                </div> </div> : <div className="cartPageMain">
                <h3>Gi??? h??ng</h3><div className="noCartDiv"><Inventory2SharpIcon />Ch??a c?? ????n h??ng n??o!</div> </div>}
        </div>
    )
}

export default CartPage;