import React, { useState } from "react";
import "../styles/ManageProduct.css"
import ProductTable from "../components/ProductTable";
import CategoryTable from "../components/CategoryTable";
import AddCategoryForm from "../components/AddCategoryForm";

function ManageProduct() {
    const [tabChosen, setTab] = useState(1);
    return (
        <div className="manageProductContainer">
            <div className="optionPageField">
                <button className={((tabChosen === 1)? "chosenOption" : "")} onClick={() => {setTab(1);}}>Bó hoa</button>
                <button className={((tabChosen === 2)? "chosenOption" : "")} onClick={() => {setTab(2);}}>Loại hoa</button>
            </div>
            <div className="manageProductMain" key={tabChosen}>
                {(tabChosen === 1) ? <ProductTable/> : (tabChosen === 2) ? <CategoryTable/> : <div></div>}
            </div>
        </div>
    )
}
export default ManageProduct;