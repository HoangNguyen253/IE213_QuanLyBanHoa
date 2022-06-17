import React, { useState } from "react";
import "../styles/AddProduct.css"
import AddProductForm from "../components/AddProductForm";
import AddCategoryForm from "../components/AddCategoryForm";

function AddProductPage() {
    const [tabChosen, setTab] = useState(1);
    return (
        <div className="addProductContainer">
            <div className="optionPageField">
                <button className={((tabChosen === 1)? "chosenOption" : "")} onClick={() => {setTab(1);}}>Thêm bó hoa mới</button>
                <button className={((tabChosen === 2)? "chosenOption" : "")} onClick={() => {setTab(2);}}>Thêm loại hoa mới</button>
            </div>
            <div className="addProductMain" key={tabChosen}>
                {(tabChosen === 1) ? <AddProductForm/> : (tabChosen === 2) ? <AddCategoryForm/> : <div></div>}
            </div>
        </div>
    )
}
export default AddProductPage;