import React, {useState} from "react";
import "../styles/AddCategoryForm.css"
import axios from "axios";

function AddCategoryForm() {
    const [loaiHoa, setLoaiHoa] = useState('');
    function insertLoaiHoa() {
        axios.post("http://localhost:3008/api/themloaihoa?tenLoaiHoa=" + loaiHoa).then(
            res => {
                console.log(res.data);
                if (res.data.status)
                {
                    alert("Thêm thành công!");
                    setLoaiHoa('');
                }
            }
        )
    }
    return (
        <div className="addCategoryFormContainer">
            <h2>Thêm loại hoa mới</h2>
            <div className="addCategoryForm">
                <div className="addCategoryData">
                    <p>Tên loại hoa</p> <input type={"text"} value={loaiHoa} onChange={(e) => setLoaiHoa(e.target.value)}></input>
                </div>
            </div>
            <button onClick={insertLoaiHoa}>Thêm mới</button>
        </div>
    )
}

export default AddCategoryForm;