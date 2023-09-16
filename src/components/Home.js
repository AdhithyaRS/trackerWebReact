import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/Logo/logo.png"; 
import "./Home.css"; // Import your CSS file for styling

function Home() {
  return (
    <div className="home-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="button-container">
        <Link to="/signup">
          <button className="signup-button">Sign Up</button>
        </Link>
        <Link to="/signin">
          <button className="signin-button">Sign In</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
