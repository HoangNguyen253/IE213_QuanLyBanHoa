import './App.css';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Shop from './pages/Shop';
import DetailItem from './pages/DetailItem';
import AddProductPage from './pages/AddProduct';
import ManageProduct from './pages/ManageProduct';
import ProductBlock from './pages/ProductBlock';
import LoginSignupPage from './pages/LoginSignupPage';
import CartPage from './pages/CartPage';
import { reactLocalStorage } from 'reactjs-localstorage';
import React, { useEffect } from 'react';
export const cartContext = React.createContext();
//reactLocalStorage.remove("cart");
function App() {
  function addToCart(item) {
    let cartSave;
    if (reactLocalStorage.get("cart") != undefined) {
      console.log(reactLocalStorage.get("cart"));
      cartSave = JSON.parse(reactLocalStorage.get("cart"));
      console.log(cartSave);
    } else {
      cartSave = [];
    }
    let iFind = -1;
    for (let i = 0; i < cartSave.length; i++) {
      if (item.maHoa * 1 == cartSave[i].maHoa * 1) {
        iFind = i;
      }
    }
    if (iFind == -1) {
      cartSave.push(item);
    } else {
      cartSave[iFind].soLuong = cartSave[iFind].soLuong * 1 + item.soLuong * 1;
    }

    reactLocalStorage.set("cart", JSON.stringify(cartSave));
    console.log(reactLocalStorage.get("cart"));
  }
  return (
    <cartContext.Provider value={{ addToCart }}>
      <div className="App">
        <Router>
          <Navbar></Navbar>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route exact path="/shop" element={<Shop />} />
            <Route exact path="/detailitem" element={<DetailItem />} />
            <Route exact path="/addproduct" element={<AddProductPage />} />
            <Route exact path="/manageproduct" element={<ManageProduct />} />
            <Route exact path="/productblock" element={<ProductBlock />} />
            <Route exact path="/cart" element={<CartPage />} />
            <Route exact path="/loginsignup" element={<LoginSignupPage />} />
          </Routes>
          <Footer />
        </Router>
      </div>
    </cartContext.Provider>
  );
}

export default App;
