import React, { useEffect, useState } from "react";
import "../styles/CartPage.css"
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { dsHoa } from "../data/dsHoa";
import { Link } from "react-router-dom";

let sampleData = dsHoa;
function CartPage() {
    const [listItem, setListItem] = useState(sampleData);
    const [renderCart, setRenderCart] = useState(null);
    function getItemByID(id) {
        return dsHoa.find(element => { return element.maHoa == id })
    }
    useEffect(() => {
        setRenderCart(listItem.map(item => (
            <tr>
                <td><DeleteSharpIcon onClick={async () => { sampleData = await listItem.filter((x) => x.maHoa !== item.maHoa); setListItem(sampleData); }} /></td>
                <td><img src={item.imgLink} /></td>
                <td><Link to="/detailitem" state={{ hoa: getItemByID(item.maHoa) }}>Hoa đẹp</Link></td>
                <td>{item.giaTien}đ</td>
                <td><input type={"number"} min={1} defaultValue={1} /></td>
                <td>{item.giaTien}đ</td>
            </tr>
        )));
    }, [listItem]);
    // let renderCart =listItem.map(item => (
    //             <tr>
    //                 <td><DeleteSharpIcon onClick={async () => {sampleData = await listItem.filter((x) => x.maHoa !== item.maHoa); console.log(sampleData); setListItem(sampleData);  }} /></td>
    //                 <td><img src={item.imgLink} /></td>
    //                 <td><Link to="/detailitem" state={{ hoa: getItemByID(item.maHoa) }}>Hoa đẹp</Link></td>
    //                 <td>{item.giaTien}đ</td>
    //                 <td><input type={"number"} min={1} defaultValue={1} /></td>
    //                 <td>{item.giaTien}đ</td>
    //             </tr>
    //         ));
    return (
        <div className="cartPageContainer">

            {(dsHoa.length>0) ? <div className="cartPageMain">
                <h3>Giỏ hàng của <span>Vinh</span></h3><table>
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
                            <td colSpan={4} style={{ textAlign: "left" }}><button>Cập nhật giỏ hàng</button></td>
                            <td><b>Tổng cộng</b></td>
                            <td><b>100.000đ</b></td>
                        </tr>
                    </tbody>
                </table>
                <div className="inputAddressField">
                    <div>
                        <p>Địa chỉ nhận hàng: </p> <input type={"text"} />
                    </div>
                    <button>Đặt hàng</button>
                </div> </div> : <div className="cartPageMain">
                <h3>Giỏ hàng của <span>Vinh</span></h3><div className="noCartDiv"><Inventory2SharpIcon />Chưa có đơn hàng nào!</div> </div>}
        </div>
    )
}

export default CartPage;