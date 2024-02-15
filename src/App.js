import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PayChecks from "./pages/paychecks";
import Companies from "./pages/companies";
import PayMethods from "./pages/paymentMethods";
import Auth from "./pages/auth";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <BrowserRouter>
      {/* <Sidebar> */}
        <Routes>
          <Route exact path="/" element={<PayChecks />} >Чеки</Route>
          <Route path="/companies" element={<Companies />} >Компании</Route>
          <Route path="/payment-methods" element={<PayMethods />} >Методы оплаты</Route>
          <Route path="/login" element={<Auth />} >Вход</Route>
        </Routes>
      {/* </Sidebar> */}
    </BrowserRouter>
  )
}

export default App;
