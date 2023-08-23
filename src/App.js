import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
// import './components/Login.css';
// import './components/Dashboard.css';

function App() {
  return (
    <BrowserRouter>
      <Routes> 
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
