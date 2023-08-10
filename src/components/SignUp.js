import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleEmailVerification = async () => {
    try {
      // Send a POST request to the backend to initiate the email verification process
      const response = await axios.post("https://localhost:8443/sendVerificationCode", {
        email: email,
      });
      const responseData = response.data;
      // Display a success message and update the state
      if (responseData.success) {
        setVerificationSent(true);
      } else {
        alert(responseData.message);
        navigate("/login");
      }
      
    } catch (error) {
      console.error("Error occurred during email verification:", error);
      // Display an error message if the request fails
    }
  };

  const handleRetryVerification = () => {
    setVerificationSent(false);
    setRetryCount(retryCount + 1);
  };

  const handleRegistration = async () => {
    try {
      // Send a POST request to the backend to register the user
      const response = await axios.post("https://localhost:8443/register", {
        email: email,
        userName: username,
        password: password,
        verificationCode: verificationCode,
      });
      const responseData = response.data;
      // Display a success message and update the state
      if(responseData.success){
        setRegistrationCompleted(true);
      }else{
        alert(responseData.message);
      }
      
    } catch (error) {
      console.error("Error occurred during registration:", error);
      // Display an error message if the request fails
    }
  };
  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <h2>Signup Page</h2>
      {!verificationSent && !registrationCompleted && (
        <>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button onClick={handleEmailVerification}>Send Verification Code</button>
        </>
      )}
      {verificationSent && !registrationCompleted && (
        <>
          <div>
            <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleRegistration}>Register</button>
          {retryCount < 3 && (
            <button onClick={handleRetryVerification}>Resend Verification Code</button>
          )}
        </>
      )}
      {registrationCompleted && (
        <div>
          <h3>Registration completed!</h3>
          <button onClick={handleGoToLogin}>Go to Login</button>
        </div>
      )}
    </div>
  );
}

export default Signup;
