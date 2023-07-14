import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/Logo/logo.png"; 

function Home() {
  return (
    <div>
      <img src={logo} alt="Logo" />
      <div>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
        <Link to="/login">
          <button>Sign In</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;