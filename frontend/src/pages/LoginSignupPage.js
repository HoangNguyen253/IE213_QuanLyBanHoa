import React, { useState } from "react";
import "../styles/LoginSignupPage.css"
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
export const formContext = React.createContext();
function LoginSignupPage() {
    const [tabChosen, setTab] = useState(1);
    return (
        <formContext.Provider value={{setTab}}>
            <div className="loginSignupContainer">
                <div className="optionPageField">
                    <button className={((tabChosen === 1) ? "chosenOption" : "")} onClick={() => { setTab(1); }}>Đăng nhập</button>
                    <button className={((tabChosen === 2) ? "chosenOption" : "")} onClick={() => { setTab(2); }}>Đăng ký</button>
                </div>
                <div className="loginSignupMain" key={tabChosen}>
                    {(tabChosen === 1) ? <LoginForm /> : (tabChosen === 2) ? <SignupForm /> : <div></div>}
                </div>
            </div>
        </formContext.Provider>

    )
}
export default LoginSignupPage;