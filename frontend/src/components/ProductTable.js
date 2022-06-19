import React, { useState, useEffect } from "react";
import "../styles/ProductTable.css"
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import { Link } from "react-router-dom";
import axios from "axios";
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
function ProductTable() {
    const [dsHoa, setHoaList] = useState([]);
    const [dsLoaiHoa, setLoaiHoaList] = useState([]);
    const callAPIGetHoaList = () => {
        axios.get("http://localhost:3008/api/hoaall").then(
            res => {
                console.log(res.data);
                setHoaList(res.data.hoas);
            }
        );
    }
    useEffect(() => {
        callAPIGetLoaiHoaList().then(function(value){
            callAPIGetHoaList();
        });
    }, []);
    const callAPIGetLoaiHoaList = () => { return new Promise(function(myResolve) {
        axios.get("http://localhost:3008/api/loaihoaall").then(
            res => {
                console.log(res.data);
                setLoaiHoaList(res.data.listLoaiHoa);
                myResolve("");
            }
        );
    })
    }
    function getTenMaLoai(maLoaiHoa) {
        let loaiHoa = dsLoaiHoa.find((lh) => {return lh.maloaihoa === maLoaiHoa});
        return loaiHoa.tenloaihoa;
    }
    let dsHoaComponent = dsHoa.map(hoa => {
        return (
            <tr>
                <td><LocalFloristIcon /></td>
                <td><img src={hoa.hinhanh} alt="hinh"/></td>
                <td><Link to={"/productblock"} state={{maHoa: hoa.mahoa}}>{hoa.tenhoa}</Link></td>
                <td>{getTenMaLoai(hoa.maloaihoa)}</td>
                <td>{formatGiaTien(String(hoa.giatien))}</td>
                <td>{hoa.soluong}</td>
            </tr>
        )
    })
    return (
        <div className="productTableContainer">
            <div className="productTableMain">
                <h3>Danh sách các sản phẩm</h3>
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
                            <th>Loại</th>
                            <th>Giá (VNĐ)</th>
                            <th>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td><DeleteSharpIcon /></td>
                            <td><img /></td>
                            <td><Link to="/detailitem">Hoa đẹp</Link></td>
                            <td>loại1</td>
                            <td>100đ</td>
                            <td>100</td>
                        </tr> */}
                        {dsHoaComponent}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default ProductTable;