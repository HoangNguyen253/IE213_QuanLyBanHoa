import React from "react";
import "../styles/AddProductForm.css"
import { useState, useEffect } from "react";
import axios from "axios";

function AddProductForm() {
    const [dsLoaiHoa, setLoaiHoaList] = useState([]);
    const [hoaInsert, setHoa] = useState({
        tenHoa: '',
        giaTien: 0,
        moTa: '',
        soLuong: 0,
        maLoaiHoa: ''
    })
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0])
      }
    useEffect(() => {
        callAPIGetLoaiHoaList();
    }, []);
    const callAPIGetLoaiHoaList = () => {
        axios.get("http://localhost:3008/api/loaihoaall").then(
            res => {
                console.log(res.data);
                setLoaiHoaList(res.data.listLoaiHoa);
                setHoa(preState => ({ ...preState, maLoaiHoa: res.data.listLoaiHoa[0].maloaihoa }));
            }
        );
    }
    let dsLoaiHoaComponent = dsLoaiHoa.map(loaihoa => {
        return (
            <option value={loaihoa.maloaihoa}>{loaihoa.tenloaihoa}</option>
        )
    })
    function insertHoa() {
        let formData = new FormData();
        formData.append("myFile", selectedFile);
        axios.post("http://localhost:3008/api/themhoa?tenHoa=" + hoaInsert.tenHoa + "&giaTien=" + hoaInsert.giaTien + "&moTa=" + hoaInsert.moTa 
        + "&soLuong=" + hoaInsert.soLuong + "&maLoaiHoa=" + hoaInsert.maLoaiHoa, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(
            res => {
                console.log(res.data);
                if (res.data.status)
                {
                    alert("Thêm thành công!");
                    setHoa({
                        tenHoa: '',
                        giaTien: 0,
                        moTa: '',
                        soLuong: 0,
                        maLoaiHoa: ''
                    });
                    setSelectedFile(null);
                }
            }
        )
    }
    return (
        <div className="addProductFormContainer">
            <h2>Thêm bó hoa mới</h2>
            <div className="addProductForm">
                <div className="addProductData">
                    <p>Tên bó hoa</p> <input type={"text"} value={hoaInsert.tenHoa} onChange={(e) => setHoa(preState => ({ ...preState, tenHoa: e.target.value }))}></input>
                </div>
                <div className="addProductData">
                    <p>Loại hoa</p> <select value={hoaInsert.maLoaiHoa} onChange={(e) => setHoa(preState => ({ ...preState, maLoaiHoa: e.target.value }))}>
                        {dsLoaiHoaComponent}
                    </select>
                </div>
                <div className="addProductData">
                    <p>Giá tiền</p> <input type={"number"} value={hoaInsert.giaTien} onChange={(e) => setHoa(preState => ({ ...preState, giaTien: e.target.value }))}></input>
                </div>
                <div className="addProductData">
                    <p>Số lượng</p> <input type={"number"} value={hoaInsert.soLuong} onChange={(e) => setHoa(preState => ({ ...preState, soLuong: e.target.value }))}></input>
                </div>
                <div className="addProductData">
                    <p>Hình ảnh</p> <input type={"file"} files={selectedFile} name="myFile" onChange={handleFileSelect}></input>
                </div>
                <div className="addProductData">
                    <p>Mô tả</p> <textarea value={hoaInsert.moTa} cols={25} rows={10} onChange={(e) => setHoa(preState => ({ ...preState, moTa: e.target.value }))}></textarea>
                </div>
            </div>
            <button onClick={insertHoa}>Thêm mới</button>
        </div>
    )
}

export default AddProductForm;