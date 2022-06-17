import React from "react";
import { Link } from "react-router-dom";

function ListCategory({tenLoaiHoa, maLoaiHoa, isChosen, tenHoa}) {
    let classNames = (isChosen === true) ? "groupName chosenCategory" : "groupName"
    return (
            <Link className={classNames} to={"/shop"} state={{maLoaiHoa: maLoaiHoa, page: 0, tenHoa: tenHoa}}>{tenLoaiHoa}</Link>
    )
}
export default ListCategory;