import React, { useState, useEffect } from "react";
import "../styles/CategoryTable.css"
import { Link } from "react-router-dom";
import axios from "axios";

function CategoryTable() {
    const [dsLoaiHoa, setLoaiHoaList] = useState([]);
    const [loaiHoaSelected, setLoaiHoa] = useState('');
    useEffect(() => {
        callAPIGetLoaiHoaList();
    }, []);
    const callAPIGetLoaiHoaList = () => { 
        axios.get("http://localhost:3008/api/loaihoaall").then(
            res => {
                console.log(res.data);
                setLoaiHoaList(res.data.listLoaiHoa);
            }
        );
    }
    function updateLoaiHoa() {
        axios.post("http://localhost:3008/api/sualoaihoa?maLoaiHoa="+loaiHoaSelected.maloaihoa+"&tenLoaiHoa="+loaiHoaSelected.tenloaihoa).then(
            res => {
                console.log(res.data);
                if (res.data.nModified >=1) {
                    alert("Cập nhật thành công");
                    callAPIGetLoaiHoaList();
                }
            }
        );
    }
    let dsLoaiHoaComponent = dsLoaiHoa.map(loaihoa => {
        return (
            <option value={loaihoa.maloaihoa}>{loaihoa.tenloaihoa}</option>
        )
    })
    return (
        <div className="categoryTableContainer">
            <div className="categoryTableMain">
                <h3>Danh sách loại hoa</h3>
                <select onChange={(e) => setLoaiHoa({maloaihoa: e.target.value, tenloaihoa:e.target.options[e.target.selectedIndex].text})}>
                    <option selected hidden>Loại hoa</option>
                    {dsLoaiHoaComponent}
                </select>
                <h4>Thông tin loại hoa</h4>
                <div>
                    <p>Tên loại hoa</p>
                    <input type={"text"} value={loaiHoaSelected.tenloaihoa} onChange={(e) => setLoaiHoa(preState => ({...preState, tenloaihoa: e.target.value}))}></input>
                </div>
                <button onClick={updateLoaiHoa}>Cập nhật loại hoa</button>
            </div>
        </div>
    )
}
export default CategoryTable;