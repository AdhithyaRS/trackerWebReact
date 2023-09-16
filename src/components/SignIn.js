
import axios from "axios";
import React, { useState , useEffect} from "react";
import { useNavigate, Link  } from "react-router-dom";
import logo from "../Images/Logo/logo.png";
import "./SignIn.css";
import { FaHome } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("CUSTOMER");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showVerificationSend, setShowVerificationSend] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPasswrod] = useState("");
  const [message, setMessage] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [reset, setReset] = useState(false);
  

  const handleLogin = async () => {
    setMessage("");
    if (/\S+@\S+\.\S+/.test(id)) {
      email = setEmail(id);
    } else if (/^\d{10}$/.test(id)) {
      phoneNumber = setPhoneNumber(id);
    }
    try {
      const response = await axios.post(`http://localhost:8080/signIn`, {
        email: email,
        phoneNumber: (countryCode + phoneNumber),
        password: password,
        userTypeCustom: userType,
      },{
        withCredentials: true,
      });

      const responseData = response.data;
      // Proceed further based on the response data
      if (responseData.success) {
        
        if (responseData.userType === "CUSTOMER") {
          navigate(`/`);
        } else if (responseData.userType === "RETAILER") {
          navigate(`/retailer`);
        }
      } else {
        setMessage(responseData.message);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      setMessage("An error occurred during login. Please try again later.");
    }
  };

  useEffect(() => {
    console.log(userType);
    console.log(reset);
    if (reset) {
      handleEmailVerification();
  }
  }, [reset]);

  const handlePasswordReset = () => {
    setMessage("");
    setShowResetPassword(true);
  };

  const handleEmailVerification = async () => {
    setMessage("");
    if (/\S+@\S+\.\S+/.test(id)) {
      email = setEmail(id);
    } else if (/^\d{10}$/.test(id)) {
      phoneNumber = setPhoneNumber(id);
    }
    try {
      const response = await axios.post("http://localhost:8080/signIn/passwordreset", {
        email: email,
        phoneNumber: (countryCode + phoneNumber),
        userTypeCustom: userType,
        reset: reset,
      });
      const responseData = response.data;
      if (responseData.success && responseData.message === "Reset") {
        // Prompt user with a confirmation dialog
        const userWantsToReset = window.confirm("Password reset process already on-going!! Do you want to begin a new session?");
        
        if (userWantsToReset) {
            setReset(true);
            console.log(userType);
            console.log(reset);
        } else {
            // Refresh the page if the user chooses not to reset
            window.location.reload();
        }
        
        return; // Prevent further execution in this cycle
    }
      if (responseData.success) {
        setVerificationSent(true);
        setShowVerificationSend(false);
        sendCodeToBackend();
      } else {
        setMessage(responseData.message);
      }
    } catch (error) {
      console.error("Error occurred during email verification:", error);
      alert("An error occurred during email verification. Please try again later.");
    }
  };

  const sendCodeToBackend = async () => {
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8080/signIn/sendCode", {
        email: email,
        phoneNumber: (countryCode + phoneNumber),
        userTypeCustom: userType,
      }); 
      const responseData = response.data;
      if (responseData.success) {
        setMessage(responseData.message);
      } else {
        setMessage(responseData.message);
      }
    } catch (error) {
      console.error("Error occurred while sending code to backend:", error);
      alert("An error occurred while sending code to the backend. Please try again later.");
    }
  };

  const handleRetryVerification = () => {
    setMessage("");
    setVerificationSent(false);
    setShowVerificationSend(true);
    setRetryCount(retryCount + 1);
  };

  const handleVerificationCodeSubmit = async () => {
    setMessage("");
    try {
      const response = await axios.post("http://localhost:8080/signIn/verifycode", {
        email: email,
        phoneNumber: (countryCode + phoneNumber),
        verificationCode: verificationCode,
      });
      const responseData = response.data;
      if (responseData.success) {
        setMessage(responseData.message);
        try {
          const response = await axios.post("http://localhost:8080/signIn/changePassword", {
            email: email,
            phoneNumber: (countryCode + phoneNumber),
            password : password,
          });
          const responseData = response.data;
          if (responseData.success) {
            alert(responseData.message);
            setVerificationSent(false);
            setShowResetPassword(false);
          } else {
            setMessage(responseData.message);
          }
        } catch (error) {
          console.error("Error occurred during verification code submission:", error);
          setMessage("An error occurred during verification code submission. Please try again later.");
        }
      } else {
        setMessage(responseData.message);
      }
    } catch (error) {
      console.error("Error occurred during verification code submission:", error);
      setMessage("An error occurred during verification code submission. Please try again later.");
    }
  };
  const handleCancelReset = () => {
    if(showResetPassword){
      setShowResetPassword(false);
    }else{
      setShowVerificationSend(false);
    }
    
  };
  
  const handleToggleUserType = () => {
    setUserType(userType === "CUSTOMER" ? "RETAILER" : "CUSTOMER");
    //console.log(userType);
  };

  return (
    <div className="login-SignIn-container">
      <div className="home-icon">
        <Link to="/home">
          <FaHome size={24} color="#333" />
        </Link>
      </div>

      <div className="center-SignIn-container">
      <div className="logo-SignIn-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="content-SignIn-container">
          {!showResetPassword ? (
            <>
            <div className="SignIn-SignIn-container">
                <h2>Sign In to Your Account</h2>
                <div className="signup-text">
                  <p>Don't have an account?</p>
                  <Link to="/signup" className="signup-link">SIGN UP</Link>
                </div>
            </div>
              
          <div className="user-type-toggle-SignIn-container">
          <span className="user-type-toggle-label">CUSTOMER</span>
            <label className="user-type-toggle">
              <input
                type="checkbox"
                onChange={handleToggleUserType}
                checked={userType === "RETAILER"}
              />
              <span className="user-type-toggle-slider"></span>
            </label>
            
            <span className="user-type-toggle-label">RETAILER</span>
            <p>{message}</p>
          </div>
              <div className="login-input">
                <h5>Enter mobile phone number or email*</h5>
                {userType === 'RETAILER' && /^\d+$/.test(id) ? (
                  <div className="phone-input-container">
                    <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                      <option value="+91">(+91) India</option>
                    </select>
                  </div>
                ) : (
                  /^\d+$/.test(id) && userType === 'CUSTOMER' ? (
                    <div className="phone-input-container">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        <option value="">Select Country Code</option>
                        <option value="+91">+91 (India)</option>
                        <option value="+1">+1 (United States)</option>
                        <option value="+20">+20 (Egypt)</option>
                        <option value="+27">+27 (South Africa)</option>
                        <option value="+33">+33 (France)</option>
                        <option value="+34">+34 (Spain)</option>
                        <option value="+39">+39 (Italy)</option>
                        <option value="+41">+41 (Switzerland)</option>
                        <option value="+44">+44 (United Kingdom)</option>
                        <option value="+46">+46 (Sweden)</option>
                        <option value="+49">+49 (Germany)</option>
                        <option value="+52">+52 (Mexico)</option>
                        <option value="+55">+55 (Brazil)</option>
                        <option value="+57">+57 (Colombia)</option>
                        <option value="+61">+61 (Australia)</option>
                        <option value="+64">+64 (New Zealand)</option>
                        <option value="+65">+65 (Singapore)</option>
                        <option value="+7">+7 (Russia)</option>
                        <option value="+81">+81 (Japan)</option>
                        <option value="+82">+82 (South Korea)</option>
                        <option value="+84">+84 (Vietnam)</option>
                        <option value="+86">+86 (China)</option>
                        <option value="+93">+93 (Afghanistan)</option>
                        <option value="+355">+355 (Albania)</option>
                        <option value="+213">+213 (Algeria)</option>
                        <option value="+54">+54 (Argentina)</option>
                        <option value="+374">+374 (Armenia)</option>
                        <option value="+994">+994 (Azerbaijan)</option>
                        <option value="+973">+973 (Bahrain)</option>
                        <option value="+880">+880 (Bangladesh)</option>
                        <option value="+375">+375 (Belarus)</option>
                        <option value="+32">+32 (Belgium)</option>
                        <option value="+591">+591 (Bolivia)</option>
                        <option value="+387">+387 (Bosnia and Herzegovina)</option>
                        <option value="+855">+855 (Cambodia)</option>
                        {/* Add other country options here */}
                      </select>
                    </div>
                  ) : null
                )}
                <input
                  type="text"
                  className="input-field"
                  placeholder=""
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                {(/^\d+$/.test(id) && !/^\d{10}$/.test(id)) && <p className="validation-alert">Enter 10 digit mobile number.</p>}
                {( !/\S+@\S+\.\S+/.test(id) && !/^\d+$/.test(id) && id ) && <p className="validation-alert">Enter valid emai-id.</p>}
                {(countryCode==="" && /^\d{10}$/.test(id)) && <p className="validation-alert">Select country code</p>}
              </div>
              <div className="login-input">
                <h5>Password*</h5>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field password-input"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="show-password-button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {password && password.length < 7 && <p className="validation-alert">Password must be at least 7 characters long.</p>}
            {password && (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) && <p className="validation-alert">Password must contain at least 1 letter and 1 number.</p>}
              </div>
              <button className="login-button" onClick={handleLogin} disabled={(!/\S+@\S+\.\S+/.test(id) && !/^\d{10}$/.test(id)) || password.length < 7 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password) || (countryCode && /^\d{10}$/.test(id))}>SIGN IN</button>
              <p className="forgot-password">
                  Forgot your password?{" "}
                    <button className="reset-button" onClick={handlePasswordReset}>
                      Reset it
                    </button>
              </p>
            </>
      ) : (
        <>
              <div className="reset-header">
                <button className="back-button" onClick={handleCancelReset}>
                  {"<"}
                </button>
                <h2>Reset Password</h2>
              </div>  
              <div className="user-type-toggle-SignIn-container">
          <span className="user-type-toggle-label">CUSTOMER</span>
            <label className="user-type-toggle">
              <input
                type="checkbox"
                onChange={handleToggleUserType}
                checked={userType === "RETAILER"}
              />
              <span className="user-type-toggle-slider"></span>
            </label>
            
            <span className="user-type-toggle-label">RETAILER</span>
            <p>{message}</p>
          </div>    
          {showVerificationSend && (
            <>
              <div className="login-input">
                <h5>Enter mobile phone number or email*</h5>
                {userType === 'RETAILER' && /^\d+$/.test(id) ? (
                  <div className="phone-input-container">
                    <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                      <option value="+91">(+91) India</option>
                    </select>
                  </div>
                ) : (
                  /^\d+$/.test(id) && userType === 'CUSTOMER' ? (
                    <div className="phone-input-container">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        <option value="">Select Country Code</option>
                        <option value="+91">+91 (India)</option>
                        <option value="+1">+1 (United States)</option>
                        <option value="+20">+20 (Egypt)</option>
                        <option value="+27">+27 (South Africa)</option>
                        <option value="+33">+33 (France)</option>
                        <option value="+34">+34 (Spain)</option>
                        <option value="+39">+39 (Italy)</option>
                        <option value="+41">+41 (Switzerland)</option>
                        <option value="+44">+44 (United Kingdom)</option>
                        <option value="+46">+46 (Sweden)</option>
                        <option value="+49">+49 (Germany)</option>
                        <option value="+52">+52 (Mexico)</option>
                        <option value="+55">+55 (Brazil)</option>
                        <option value="+57">+57 (Colombia)</option>
                        <option value="+61">+61 (Australia)</option>
                        <option value="+64">+64 (New Zealand)</option>
                        <option value="+65">+65 (Singapore)</option>
                        <option value="+7">+7 (Russia)</option>
                        <option value="+81">+81 (Japan)</option>
                        <option value="+82">+82 (South Korea)</option>
                        <option value="+84">+84 (Vietnam)</option>
                        <option value="+86">+86 (China)</option>
                        <option value="+93">+93 (Afghanistan)</option>
                        <option value="+355">+355 (Albania)</option>
                        <option value="+213">+213 (Algeria)</option>
                        <option value="+54">+54 (Argentina)</option>
                        <option value="+374">+374 (Armenia)</option>
                        <option value="+994">+994 (Azerbaijan)</option>
                        <option value="+973">+973 (Bahrain)</option>
                        <option value="+880">+880 (Bangladesh)</option>
                        <option value="+375">+375 (Belarus)</option>
                        <option value="+32">+32 (Belgium)</option>
                        <option value="+591">+591 (Bolivia)</option>
                        <option value="+387">+387 (Bosnia and Herzegovina)</option>
                        <option value="+855">+855 (Cambodia)</option>
                        {/* Add other country options here */}
                      </select>
                    </div>
                  ) : null
                )}
                <input
                  type="text"
                  className="input-field"
                  placeholder=""
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                {(/^\d+$/.test(id) && !/^\d{10}$/.test(id)) && <p className="validation-alert">Enter 10 digit mobile number.</p>}
                {(!/\S+@\S+\.\S+/.test(id) && !/^\d+$/.test(id) && id) && <p className="validation-alert">Enter valid emai-id.</p>}
                {(countryCode && /^\d{10}$/.test(id)) && <p className="validation-alert">Select country code</p>}
              </div>
              <button className="login-button" onClick={handleEmailVerification} disabled={(!/\S+@\S+\.\S+/.test(id) && !/^\d{10}$/.test(id)) || (countryCode && /^\d{10}$/.test(id))}>Send Verification Code</button>
            </>
          )}
        </>
      )}
      {verificationSent && (
  <>
    <div style={{ display: "flex", alignItems: "center" }}>
      <h5 style={{ marginRight: "10px" }}>Verification Code*</h5>
      <input
        type="text"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <h5 style={{ marginRight: "10px" }}>New Password*</h5>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPasswrod(e.target.value)}
      />
    </div>
    <button onClick={handleVerificationCodeSubmit}>Submit</button>
    {retryCount < 3 && (
      <button onClick={handleRetryVerification}>
        Resend Verification Code
      </button>
    )}
  </>
)}
</div>
    </div>
    </div>
  );
}

export default Login;
