import React from "react";
import { useLocation } from "react-router-dom";

function CustomerProfile() {
  const location = useLocation();
  const { customerData } = location.state;

  return (
    <div>
      <h2>User Profile</h2>
      {customerData ? (
        <div>
          <ul>
            <li>Phone Number : {customerData.phoneNumber}</li>
            <li>Email-id : {customerData.email}</li>            
          </ul>
        </div>
      ) : (
        <div>No user data found.</div>
      )}
    </div>
  );
}

export default CustomerProfile;