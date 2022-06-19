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
import ListOrder from './pages/ListOrder';
import DetailOrder from './pages/DetailOrderPage';
import MyOrdersPage from './pages/MyOrdersPage';
import MyDetailOrderPage from './pages/MyDetailOrderPage';
import NotFoundPage from './pages/NotFoundPage';
import CartPage from './pages/CartPage';
import { reactLocalStorage } from 'reactjs-localstorage';
import React, { useEffect, useState } from 'react';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLogin, setUser] = useState(null);
  function getUserInLocal() {
      return new Promise(function (myResolve) {
          let userSave = reactLocalStorage.getObject('user');
          console.log(userLogin, " ", userSave);
          if (Object.keys(userSave).length) {
              if (userLogin) {
                  if (!(userLogin.tendangnhap == userSave.tendangnhap
                      || userLogin.matkhau == userSave.matkhau)) {
                      setUser(reactLocalStorage.getObject('user'));
                  }
              } else {
                  setUser(reactLocalStorage.getObject('user'));
              }
              myResolve('');
          }
      })
  }
  useEffect(() => {
      getUserInLocal().then(function (value) {
          (userLogin != null) ? (userLogin.maloainguoidung === 2) ? setIsAdmin(false) : setIsAdmin(true) : setIsAdmin(false);
      });
  });
  return (
    <cartContext.Provider value={{ addToCart }}>
      <div className="App">
        <Router>
          <Navbar></Navbar>
          {(isAdmin) ? <Routes>
            <Route path="/" exact element={<Home />} />
            <Route exact path="/addproduct" element={<AddProductPage />} />
            <Route exact path="/manageproduct" element={<ManageProduct />} />
            <Route exact path="/productblock" element={<ProductBlock />} />
            <Route exact path="/listorder" element={<ListOrder />} />
            <Route exact path="/detailorder" element={<DetailOrder />} />
            <Route exact path="/loginsignup" element={<LoginSignupPage />} />
            <Route exact path="*" element={<NotFoundPage/>}></Route>
          </Routes> 
          :
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route exact path="/shop" element={<Shop />} />
            <Route exact path="/detailitem" element={<DetailItem />} />
            <Route exact path="/myorders" element={<MyOrdersPage />} />
            <Route exact path="/mydetailorder" element={<MyDetailOrderPage/>} />
            <Route exact path="/cart" element={<CartPage />} />
            <Route exact path="/loginsignup" element={<LoginSignupPage />} />
            <Route exact path="*" element={<NotFoundPage/>}></Route>
          </Routes>}
          {/* <Routes>
            <Route path="/" exact element={<Home />} />
            <Route exact path="/shop" element={<Shop />} />
            <Route exact path="/detailitem" element={<DetailItem />} />
            <Route exact path="/addproduct" element={<AddProductPage />} />
            <Route exact path="/manageproduct" element={<ManageProduct />} />
            <Route exact path="/productblock" element={<ProductBlock />} />
            <Route exact path="/listorder" element={<ListOrder />} />
            <Route exact path="/detailorder" element={<DetailOrder />} />
            <Route exact path="/myorders" element={<MyOrdersPage />} />
            <Route exact path="/cart" element={<CartPage />} />
            <Route exact path="/loginsignup" element={<LoginSignupPage />} />
          </Routes> */}
          <Footer />
        </Router>
      </div>
    </cartContext.Provider>
  );
}

export default App;
