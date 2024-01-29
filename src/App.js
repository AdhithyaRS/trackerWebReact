import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import RetailerHeader from "./components/RetailerHeader"; 
import RetailerProfile from "./components/RetailerProfile";
import MainHeader from "./components/MainHeader";
import CustomerProfile from "./components/CustomerProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes> 
      <Route path="/retailer/*" element={<RetailerPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// RetailerPage component manages the conditional rendering of RetailerHeader and RetailerProfile
function RetailerPage() {
  return (
    <div>
      <RetailerHeader /> {/* Render RetailerHeader */}
      <Routes>
        <Route path="/profile" element={<RetailerProfile />} />
        
      </Routes>
    </div>
  );
}

// MainPage component manages the conditional rendering of MainHeader and CustomerProfile
function MainPage() {
  return (
    <div>
      <MainHeader /> {/* Render MainHeader */}
      <Routes>
        <Route path="/profile" element={<CustomerProfile />} />
        
      </Routes>
    </div>
  );
}

export default App;
