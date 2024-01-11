import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate , Link } from "react-router-dom";
import logo from "../Images/Logo/logo.png";
import "./RetailerHeader.css";

function MainHeader() {
    const cachedCustomerData = JSON.parse(localStorage.getItem("cachedCustomerData"));
    const [customerData, setCustomerData] = useState(cachedCustomerData || null);
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    
    // Function to fetch customer data from the backend
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/customer`, {
          withCredentials: true,
        });
      // Check if customerData is null and data exists in local storage
        if (!customerData && cachedCustomerData) {
            setCustomerData(cachedCustomerData);
        } else if (!customerData) {
            const responseCustomer = await axios.get(`http://localhost:8080/customer/profile`, {
            withCredentials: true,
            });

            setCustomerData(responseCustomer.data);
            localStorage.setItem("cachedCustomerData", JSON.stringify(responseCustomer.data));
        }
        
      } catch (error) {
        if (error.response && error.response.data) {
            console.log("In If block");
        }
        localStorage.removeItem("cachedCustomerData");
        setCustomerData(null);
        navigate(`/`);
      }
      
    };

    fetchCustomerData();
  }, [customerData]);

  const handleProfileClick = async () => {
    setShowDropdown(!showDropdown);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleProfileOptionClick = async (option) => {
    if (option === 'profile') {
      navigate(`/profile`, { state: { customerData } });
    } else if (option === 'signout') {
      try {
        // Call backend to sign out
        await axios.get(`http://localhost:8080/customer/signout`, {
          withCredentials: true,
        });
        // If signout is successful, redirect to /
        localStorage.removeItem("cachedCustomerData");
        setCustomerData(null);
        navigate(`/`);
      } catch (error) {
        if (error.response && error.response.data) {
            console.log("In If block");
          alert(error.response.data);
        } else {
            console.log("In Else block");
          alert('Unknown error occurred.');
        }
        localStorage.removeItem("cachedCustomerData");
        setCustomerData(null);
        navigate(`/`);
      }
    }
    setShowDropdown(false); // Close the dropdown after selection
  };
  return (
    <div className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" />
      </div>
      <div className="header-middle">
        <input type="text" placeholder="Search for a retailer" />
      </div>
      <div className="header-right">
      {customerData ? (
        <div className="profile-container">
          <div className="profile" onMouseEnter={handleProfileClick} onMouseLeave={handleMouseLeave}>
            <span>{customerData.userName}</span>
            {showDropdown && (
              <div className="dropdown">
                <div onClick={() => handleProfileOptionClick('profile')}>Profile</div>
                <div onClick={() => handleProfileOptionClick('signout')}>Sign Out</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="signin-container">
          <Link to="/signin">Hello, Sign In</Link>
        </div>)}
        </div>
    </div>
  );
}

export default MainHeader;
