import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/ProductBlock.css"
import axios from "axios";

function ProductBlock() {
  let maHoaOnPage = 0;
  const location = useLocation();
  if (location.state) {
    maHoaOnPage = location.state.maHoa;
  }
  const [hoaOnPage, setHoa] = useState({});
  const [dsLoaiHoa, setLoaiHoaList] = useState([]);
  const [isEnableUpdate, setEnableUpdate] = useState(false);
  const callAPIGetHoaByID = () => {
    axios.get("http://localhost:3008/api/gethoabyma?maHoa=" + maHoaOnPage).then(
      res => {
        console.log(res.data);
        setHoa(res.data.hoa);
      }
    );
  }
  const callAPIGetLoaiHoaList = () => {
    axios.get("http://localhost:3008/api/loaihoaall").then(
      res => {
        console.log(res.data);
        setLoaiHoaList(res.data.listLoaiHoa);
      }
    );
  }
  useEffect(() => {
    callAPIGetLoaiHoaList();
    callAPIGetHoaByID();
  }, [maHoaOnPage]);
  let optionLoaiHoaComponent = dsLoaiHoa.map(lh => {
    return (
      <option value={lh.maloaihoa} key={lh.maloaihoa}>{lh.tenloaihoa}</option>
    );
  })
  function updateHoa() {
    axios.post("http://localhost:3008/api/suahoa?maHoa=" + hoaOnPage.mahoa + "&tenHoa=" + hoaOnPage.tenhoa +
      "&giaTien=" + hoaOnPage.giatien + "&moTa=" + hoaOnPage.mota + "&soLuong=" + hoaOnPage.soluong + "&maLoaiHoa=" + hoaOnPage.maloaihoa).then(
        res => {
          console.log(res.data);
          if (res.data.nModified >= 1) alert("Cập nhật thành công!");
          else {
            alert("Cập nhật thất bại!");
          }
        }
      );
  }
  function updateAnhHoa() {
    
  }
  return (
    <div className="updateProductFormBack">
      <div className="updateProductFormContainer">
        <h2>THÔNG TIN BÓ HOA</h2>
        <div className="updateProductForm">
          <div className="updateProductData">
            <img src={hoaOnPage.hinhanh} alt='hinh'></img>
          </div>
          <div className="updateProductData">
            <p>Hình ảnh</p> <input type={"file"} style={{width: "50%"}}></input>
            <button style={{width: "50px", marginLeft:"10px"}}>Sửa</button>
          </div>
          <div className="updateProductData">
            <p>Tên bó hoa</p> <input type={"text"} value={hoaOnPage.tenhoa} onChange={(e) => { setHoa(preState => ({ ...preState, tenhoa: e.target.value })) }}></input>
          </div>
          <div className="updateProductData">
            <p>Loại hoa</p> <select value={hoaOnPage.maloaihoa} onChange={(e) => { setHoa(preState => ({ ...preState, maloaihoa: e.target.value })) }}>
              {/* <option>Hoa cảnh</option>
              <option>Hoa kiểng</option> */}
              {optionLoaiHoaComponent}
            </select>
          </div>
          <div className="updateProductData">
            <p>Giá tiền</p> <input type={"number"} value={hoaOnPage.giatien} onChange={(e) => { setHoa(preState => ({ ...preState, giatien: e.target.value })) }}></input>
          </div>
          <div className="updateProductData">
            <p>Số lượng</p> <input type={"number"} value={hoaOnPage.soluong} onChange={(e) => { setHoa(preState => ({ ...preState, soluong: e.target.value })) }}></input>
          </div>
          <div className="updateProductData">
            <p>Mô tả</p> <textarea cols={31} rows={10} value={hoaOnPage.mota} onChange={(e) => { setHoa(preState => ({ ...preState, mota: e.target.value })) }}></textarea>
          </div>
        </div>
        <button onClick={updateHoa}>Cập nhật</button>
      </div>
    </div>
  );
}

export default ProductBlock;
