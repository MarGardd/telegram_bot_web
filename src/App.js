import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PayChecks from "./pages/paychecks";
import Companies from "./pages/companies";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <BrowserRouter>
      {/* <Sidebar> */}
        <Routes>
          <Route exact path="/" element={<PayChecks />} >Чеки</Route>
          <Route path="/companies" element={<Companies />} >Компании</Route>
        </Routes>
      {/* </Sidebar> */}
    </BrowserRouter>
  )
}

export default App;
