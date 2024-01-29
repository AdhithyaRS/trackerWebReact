import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import logo from "../Images/Logo/logo.png";
import "./RetailerHeader.css";

function RetailerHeader() {
    const cachedRetailerData = JSON.parse(localStorage.getItem("cachedRetailerData"));
    const [retailerData, setRetailerData] = useState(cachedRetailerData || null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    
    // Function to fetch retailer data from the backend
    const fetchRetailerData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/retailer`, {
          withCredentials: true,
        });
      // Check if retailerData is null and data exists in local storage
        if (!retailerData && cachedRetailerData) {
            setRetailerData(cachedRetailerData);
        } else if (!retailerData) {
            const responseRetailer = await axios.get(`http://localhost:8080/retailer/profile`, {
            withCredentials: true,
            });

            setRetailerData(responseRetailer.data);
            localStorage.setItem("cachedRetailerData", JSON.stringify(responseRetailer.data));
        }
        
      } catch (error) {
        if (error.response && error.response.data) {
            console.log("In If block");
          setErrorMessage(error.response.data);
          alert(error.response.data);
        } else {
            console.log("In Else block");
          setErrorMessage('Unknown error occurred.');
          alert('Unknown error occurred.');
        }
        localStorage.removeItem("cachedRetailerData");
        setRetailerData(null);
        navigate(`/signin`);
      }
      
    };

    fetchRetailerData();
  }, [retailerData]);

  const handleProfileClick = async () => {
    setShowDropdown(!showDropdown);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleProfileOptionClick = async (option) => {
    if (option === 'profile') {
      navigate(`/retailer/profile`, { state: { retailerData } });
    } else if (option === 'signout') {
      try {
        // Call backend to sign out
        await axios.get(`http://localhost:8080/retailer/signout`, {
          withCredentials: true,
        });
        // If signout is successful, redirect to /signin
        alert("Sign Out Success!!")
        localStorage.removeItem("cachedRetailerData");
        navigate(`/signin`);
      } catch (error) {
        if (error.response && error.response.data) {
            console.log("In If block");
          setErrorMessage(error.response.data);
          setRetailerData(null);
          alert(error.response.data);
        } else {
            console.log("In Else block");
          setErrorMessage('Unknown error occurred.');
          alert('Unknown error occurred.');
        }
        localStorage.removeItem("cachedRetailerData");
        setRetailerData(null);
        navigate(`/signin`);
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
        {retailerData ? <h1>{retailerData.companyBrand}</h1> : <div>Loading...</div>}
      </div>
      <div className="header-right">
      {retailerData && (
        <div className="profile-container">
          <div className="profile" onMouseEnter={handleProfileClick} onMouseLeave={handleMouseLeave}>
            <span>{retailerData.userName}</span>
            {showDropdown && (
              <div className="dropdown">
                <div onClick={() => handleProfileOptionClick('profile')}>Profile</div>
                <div onClick={() => handleProfileOptionClick('signout')}>Sign Out</div>
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
}

export default RetailerHeader;
