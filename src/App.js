import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PayChecks from "./pages/paychecks";
import Companies from "./pages/companies";
import PayMethods from "./pages/paymentMethods";
import Auth from "./pages/auth";
import Users from "./pages/users";
import { isAuth } from "./components/IsAuth";
import { Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import { UserContext } from "./components/UserContext";
import { CircularProgress } from "@mui/material";
import Image from "./pages/image";

const App = () => {
  const userData = useContext(UserContext);
  const token = localStorage.getItem('vostorg-token')
  React.useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }, [])

  if (token && !userData) {
    return (<div className=" h-screen w-screen flex items-center justify-center">
              <div className=""><CircularProgress /></div>
            </div>)
  }

  return (
    <BrowserRouter>
      {/* <Sidebar> */}
      <Routes>
        {isAuth() ? (
          <>
            <Route path="/" element={<PayChecks />} >Чеки</Route>
            <Route path="/companies" element={<Companies />} >Компании</Route>
            <Route path="/image/:id" element={<Image />} >Картинка</Route>
            <Route path="/payment-methods" element={<PayMethods />} >Методы оплаты</Route>
            <Route path="/users" element={userData.is_admin ? <Users /> : <Navigate to="/" />} >Пользователи</Route>
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route path="/login" element={!isAuth() ? <Auth /> : <Navigate to="/" />} >Вход</Route>
      </Routes>
      {/* </Sidebar> */}
    </BrowserRouter>
  )
}

export default App;
