import React from "react";
import { useLocation } from "react-router-dom";

function RetailerProfile() {
  const location = useLocation();
  const { retailerData } = location.state;

  return (
    <div>
      <h2>Retailer Profile</h2>
      {retailerData ? (
        <div>
          <ul>
            <li>Phone Number : {retailerData.phoneNumber}</li>
            <li>Email-id : {retailerData.email}</li>
            <li>Company Name : {retailerData.companyBrand}</li>
            <li>Address : {retailerData.companyAddress}</li>
            <li>City : {retailerData.companyCity}</li>
            <li>Pincode : {retailerData.companyPincode}</li>
            <li>State : {retailerData.companyState}</li>
            
          </ul>
        </div>
      ) : (
        <div>No retailer data found.</div>
      )}
    </div>
  );
}

export default RetailerProfile;