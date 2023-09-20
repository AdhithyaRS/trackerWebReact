import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import Customer from "./components/Customer";
import Retailer from "./components/Retailer";
import Home from "./components/Home";
import SignUp from "./components/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes> 
      <Route path="/" element={<Customer />} />
      <Route path="/retailer" element={<Retailer />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
