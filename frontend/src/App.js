import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginComponent from "./components/login.component";
import RegisterComponent from "./components/register.component";
import HomeComponent from "./components/home.component";
import CreditDebit from "./components/creditDebit.component";
import LogOut from "./components/logout.component";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<RegisterComponent />} />
          <Route path="/login" exact element={<LoginComponent />} />
          <Route path="/home" exact element={<HomeComponent />} />
          <Route path="/transactions" exact element={<CreditDebit />} />
          <Route path="/logout" exact element={<LogOut />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
