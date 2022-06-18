import './App.css';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from './pages/Home';
import Shop from './pages/Shop';
import DetailItem from './pages/DetailItem';
import AddProductPage from './pages/AddProduct';
import LoginSignupPage from './pages/LoginSignupPage';
import CartPage from './pages/CartPage';
import {reactLocalStorage} from 'reactjs-localstorage';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route exact path="/shop" element={<Shop/>} />
          <Route exact path="/detailitem" element={<DetailItem/>} />
          <Route exact path="/addproduct" element={<AddProductPage/>}/>
          <Route exact path="/cart" element={<CartPage/>}/>
          <Route exact path="/loginsignup" element={<LoginSignupPage/>}/>
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
