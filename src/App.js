import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PayChecks from "./pages/paychecks";
import Companies from "./pages/companies";
import PayMethods from "./pages/paymentMethods";
import Auth from "./pages/auth";
import Users from "./pages/users";
import { isAuth } from "./components/IsAuth";
import { Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

console.log(isAuth())

const App = () => {
  return (
    <BrowserRouter>
      {/* <Sidebar> */}
      <Routes>
        {isAuth() ? (
          <>
          <Route path="/" element={<PayChecks />} >Чеки</Route>
          <Route path="/companies" element={<Companies />} >Компании</Route>
          <Route path="/payment-methods" element={<PayMethods />} >Методы оплаты</Route>
          <Route path="/users" element={<Users />} >Пользователи</Route>
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
        <Route path="/login"  element={!isAuth() ? <Auth /> : <Navigate to="/" />} >Вход</Route>
      </Routes>
      {/* </Sidebar> */}
    </BrowserRouter>
  )
}

export default App;
