import React from "react";
import "../styles/AddProductForm.css"

function AddProductForm() {
    return (
        <div className="addProductFormContainer">
            <h2>Thêm bó hoa mới</h2>
            <div className="addProductForm">
                <div className="addProductData">
                    <p>Tên bó hoa</p> <input type={"text"}></input>
                </div>
                <div className="addProductData">
                    <p>Loại hoa</p> <select>
                        <option>Hoa cảnh</option>
                        <option>Hoa kiểng</option>
                    </select>
                </div>
                <div className="addProductData">
                    <p>Giá tiền</p> <input type={"number"}></input>
                </div>
                <div className="addProductData">
                    <p>Số lượng</p> <input type={"number"}></input>
                </div>
                <div className="addProductData">
                    <p>Hình ảnh</p> <input type={"file"}></input>
                </div>
                <div className="addProductData">
                    <p>Mô tả</p> <textarea cols={25} rows={10}></textarea>
                </div>
            </div>
            <button>Thêm mới</button>
        </div>
    )
}

export default AddProductForm;