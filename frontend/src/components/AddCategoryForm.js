import React from "react";
import "../styles/AddCategoryForm.css"

function AddCategoryForm() {
    return (
        <div className="addCategoryFormContainer">
            <h2>Thêm loại hoa mới</h2>
            <div className="addCategoryForm">
                <div className="addCategoryData">
                    <p>Tên loại hoa</p> <input type={"text"}></input>
                </div>
            </div>
            <button>Thêm mới</button>
        </div>
    )
}

export default AddCategoryForm;