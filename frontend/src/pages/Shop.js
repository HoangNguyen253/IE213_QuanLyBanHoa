import React, { useEffect, useState } from "react";
import ListCategory from "../components/ListCategory";
import ListItem from "../components/ListItem";
import "../styles/Shop.css";
import { useLocation } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { Link } from "react-router-dom";

function Shop() {
    const location = useLocation();
    let maLoaiHoa = '';
    let pageOn = 0;
    let tenHoaOnPage = '';

    const [hoasPerPage, setHoasPerPage] = useState(0);
    const [totalHoas, setTotalHoas] = useState(0);
    let paginationComponent = [];
    if (location.state) {
        maLoaiHoa = location.state.maLoaiHoa;
        pageOn = location.state.page;
        tenHoaOnPage = location.state.tenHoa;
    }


    const [dsHoa, setHoaList] = useState([]);
    const [dsLoaiHoa, setLoaiHoaList] = useState([]);
    const [inputTenHoaValue, setInputTenHoaValue] = useState('');


    const callAPIGetHoaList = () => {
        axios.get("http://localhost:3008/api/hoa?hoasPerPage=6&page="+ pageOn + "&maloaihoa=" + maLoaiHoa + "&tenhoa=" + tenHoaOnPage).then(
            res => {
                console.log(res.data);
                setHoaList(res.data.hoas);
                setHoasPerPage(res.data.entries_per_page);
                setTotalHoas(res.data.total_results);
            }
        );
    }
    useEffect(() => {
        callAPIGetHoaList();
    }, [maLoaiHoa, pageOn, tenHoaOnPage]);

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
    }, [maLoaiHoa, pageOn, tenHoaOnPage]);

    let dsHoaHienThiComponent = dsHoa.map((hoa) => {
        return (
            <ListItem
                key={hoa.mahoa}
                imgLink={hoa.hinhanh}
                tenHoa={hoa.tenhoa}
                giaTien={hoa.giatien}
                maHoa = {hoa.mahoa}
                maLoaiHoa = {hoa.maloaihoa}
            />
        );
    })

    for(let i = 1; i<= Math.ceil(totalHoas*1.0/hoasPerPage); i++)
    {
        if (pageOn + 1 == i)
            paginationComponent.push(<Link key={i} to="/shop" state={{maLoaiHoa: maLoaiHoa, page: i-1, tenHoa: tenHoaOnPage}} className="active">{i}</Link>)
        else 
            paginationComponent.push(<Link key={i} to="/shop" state={{maLoaiHoa: maLoaiHoa, page: i-1, tenHoa: tenHoaOnPage}}>{i}</Link>)
    } 

    return (
        <div className="listFloContainer">
            <div className="listCategory">
                <div>Tìm kiếm hoa</div>
                <div className="searchListField">
                    <input className="inputTenHoa" defaultValue={inputTenHoaValue} onChange={(e) => setInputTenHoaValue(e.target.value)}></input>
                    <Link to="/shop" state={{maLoaiHoa: maLoaiHoa, page: pageOn, tenHoa: inputTenHoaValue}}><SearchIcon></SearchIcon></Link>
                </div>
                <div>Danh mục hoa</div>
                {dsLoaiHoa.map((loaiHoa) => {
                    if (loaiHoa.maloaihoa == maLoaiHoa)
                        return (
                            <ListCategory isChosen={true}
                                key={loaiHoa.maloaihoa}
                                tenLoaiHoa={loaiHoa.tenloaihoa}
                                maLoaiHoa={loaiHoa.maloaihoa}
                                tenHoa={tenHoaOnPage}></ListCategory>
                        )
                    else return (
                        <ListCategory isChosen={false}
                            key={loaiHoa.maloaihoa}
                            tenLoaiHoa={loaiHoa.tenloaihoa}
                            maLoaiHoa={loaiHoa.maloaihoa}
                            tenHoa={tenHoaOnPage}></ListCategory>
                    )
                })}
                {(maLoaiHoa == '') ?
                    <ListCategory isChosen={true}
                        key={''}
                        tenLoaiHoa={'Tất cả loại hoa'}
                        maLoaiHoa={''}
                        tenHoa={tenHoaOnPage}></ListCategory> :
                    <ListCategory isChosen={false}
                        key={''}
                        tenLoaiHoa={'Tất cả loại hoa'}
                        maLoaiHoa={''}
                        tenHoa={tenHoaOnPage}></ListCategory>}
            </div>
            <div className="listFloField">
                <div className="listFlo">
                    {(dsHoaHienThiComponent.length > 0) ? dsHoaHienThiComponent : <div style={{ height: '100vh' }}>Không có sản phẩm hoa nào!</div>}
                </div>
                <div className="pagination">
                    {/* <a href="#">&laquo;</a> */}
                    {paginationComponent}
                    {/* <a href="#">&raquo;</a> */}
                </div>
            </div>
        </div>
    );
}

export default Shop;