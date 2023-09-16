import React, { useState, useEffect } from "react";
import { useNavigate ,Link} from "react-router-dom";
import axios from "axios";
import logo from "../Images/Logo/logo.png";
import "./SignUp.css";
import { FaHome } from "react-icons/fa";

function Signup() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationOngoing, setVerificationOngoing] = useState(false);
  const [countryCode, setCountryCode] = useState("91");
  const [userType, setUserType] = useState("CUSTOMER");
  const [reset, setReset] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberVerificationCode, setPhoneNumberVerificationCode] = useState("");
  const [companyBrand, setcompanyBrand] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPincode, setCompanyPincode] = useState("");
  const [companyState, setCompanyState] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const [retryCount, setRetryCount] = useState(-1);


  const handleEmailVerification = async () => {
    try {
      
      setMessage("");
      const response = await axios.post("http://localhost:8080/signUp", {
        email: email,
        phoneNumber: (countryCode + phoneNumber),
        userTypeCustom: userType,
        reset: reset,
      },{
        withCredentials: true,
      });
      const responseData = response.data;
      if (responseData.success && responseData.message === "Reset") {
        // Prompt user with a confirmation dialog
        const userWantsToReset = window.confirm("Sign Up process already on-going!! Do you want to begin a new session?");
        
        if (userWantsToReset) {
            setReset(true);
            console.log(userType);
            console.log(reset);
            //handleEmailVerification();
        } else {
            // Refresh the page if the user chooses not to reset
            window.location.reload();
        }
        
        return; // Prevent further execution in this cycle
    }
      if (responseData.success) {
        setReset(false);
        setVerificationSent(true);
        setShowResetPassword(true);
        setRetryCount(-1);
        handleRetryVerification();
      } else {
        
        setMessage(responseData.message);
      }
      
    } catch (error) {
      setMessage("Error occurred during user details validation");
      console.error("Error occurred during user details validation:", error);
    }
  };

  const handleRetryVerification = async () => {
    setMessage("");
    if (retryCount < 3) {
        try {
            setVerificationOngoing(true);
            const response = await axios.post("http://localhost:8080/signUp/sendVerificationCode", {
                email: email,
                phoneNumber: (countryCode + phoneNumber),
                userTypeCustom: userType,
            }, {
                withCredentials: true,
            });
            const responseData = response.data;
            if (responseData.success) {
                setRetryCount(retryCount + 1);
                setMessage(responseData.message);
            } else {
                setMessage(responseData.message);
            }

        } catch (error) {
            if (!error.response) {
                console.error("Network error or CORS issue:", error.message);
                setMessage("Network error. Please check your connection.");
            } else {
                console.error("Error occurred during dispatch of verification code:", error.response.data);

                switch (error.response.status) {
                    case 401: // Unauthorized
                        if (error.response.data === "Token has expired") {
                            setMessage("Your session has expired. Please start over again.");
                            // Optionally, redirect to login page or refresh the token
                        } else {
                            setMessage("Unauthorized access. Please sign up.");
                            // Optionally, redirect to login page
                        }
                        break;

                    case 400: // Bad Request
                        setMessage("Invalid request. Please check your data and try again.");
                        break;

                    case 500: // Internal Server Error
                        setMessage("An unexpected error occurred on the server. Please try again later.");
                        break;

                    default:
                        setMessage("An error occurred. Please try again.");
                        break;
                }
            }
        }
    } else {
        if (userType === "CUSTOMER") {
            setMessage("Maximum tries reached!! Please check your email-id and try again");
        } else {
            setMessage("Maximum tries reached!! Please check your email-id/Mobile number and try again");
        }
        setShowResetPassword(false);
        setVerificationSent(false);
        setVerificationOngoing(false);
        setMessage("");
        setRetryCount(-1);
    }
};

  const handleRegistration = async () => {
    try {
      setMessage("");
      const verifyResponse = await axios.post("http://localhost:8080/signUp/verifyCode", {
        
        email: email,
        phoneNumber: (countryCode + phoneNumber),
        phoneNumberVerificationCode: phoneNumberVerificationCode,
        emailVerificationCode: emailVerificationCode,
      },{
        withCredentials: true,
      });
  
      const verifyData = verifyResponse.data;
      
      if (verifyData.success) {
        setMessage("");
        const registerResponse = await axios.post("http://localhost:8080/signUp/register", {
          email: email,
          userName: username,
          password: password,
          phoneNumber: (countryCode + phoneNumber),
          companyBrand: companyBrand,
          companyCity: companyCity,
          companyAddress: companyAddress,
          companyPincode: companyPincode,
          companyState: companyState,
          userTypeCustom: userType,
          countryCode: countryCode,
        },{
          withCredentials: true,
        });
  
        const registerData = registerResponse.data;
        if (registerData.success) {
          setRegistrationCompleted(true);
        } else {
          setMessage(registerData.message);
        }
      } else {
        setMessage(verifyData.message);
      }
    } catch (error) {
      if (!error.response) {
        console.error("Network error or CORS issue:", error.message);
        setMessage("Network error. Please check your connection.");
      } else {
        console.error("Error occurred during registration:", error.response.data);
  
        switch (error.response.status) {
          case 401: // Unauthorized
            if (error.response.data === "Token has expired") {
              setMessage("Your session has expired. Please start over again.");
              // Optionally, redirect to login page or refresh the token
            } else {
              setMessage("Unauthorized access. Please sign up.");
              // Optionally, redirect to login page
            }
            break;
  
          case 400: // Bad Request
            setMessage("Invalid request. Please check your data and try again.");
            break;
  
          case 500: // Internal Server Error
            setMessage("An unexpected error occurred on the server. Please try again later.");
            break;
  
          default:
            setMessage("An error occurred. Please try again.");
            break;
        }
      }
    }
  };
  
  const handleGoToLogin = () => {
    navigate("/signin");
  };
  useEffect(() => {
    console.log(userType);
    console.log(reset);
    if (reset) {
      handleEmailVerification();
  }
  }, [reset]);
  const handleToggleUserType = () => {
    if (!verificationOngoing) {
      setUserType(userType === "CUSTOMER" ? "RETAILER" : "CUSTOMER");
      setUsername("");
      setEmailVerificationCode("");
      setPhoneNumberVerificationCode("");
      setcompanyBrand("");
      setCompanyAddress("");
      setCompanyCity("");
      setPassword("");
      setCompanyPincode("");
      setCompanyState("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
      setReset(false);
    }
    //console.log(userType);
  };
  const handleCancelReset = () => {
    setShowResetPassword(false);
    setVerificationSent(false);
    setVerificationOngoing(false);
    setMessage("");
    setRetryCount(-1);
    setReset(false);
  };

  return (
    <div className="signup-container">
      <div className="home-icon">
        <Link to="/home">
          <FaHome size={24} color="#333" />
        </Link>
      </div>
      <div className="center-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="content-container">
            <div className="SignUp-container">
              {showResetPassword && (
                <div className="back-button-container">
                <button className="back-button" onClick={handleCancelReset}>
                  {"<"}
                </button>
              </div>
              )}
                <h2>Create your account</h2>
                <div className="signIn-text">
                  <p>Already have an account?</p>
                  <Link to="/signin" className="login-link">SIGN IN</Link>
                </div>
            </div>
            <div className="user-type-toggle-container">
          <span className="user-type-toggle-label">CUSTOMER</span>
            <label className="user-type-toggle">
              <input
                type="checkbox"
                onChange={handleToggleUserType}
                checked={userType === "RETAILER"}
                disabled={verificationOngoing}
              />
              <span className="user-type-toggle-slider"></span>
            </label>
            
            <span className="user-type-toggle-label">RETAILER</span>
          </div>
      {!verificationSent && !registrationCompleted && (
        <>
        <p>{message}</p>
          <div>
          <h5>Email*</h5>
            <input
              type="text"
              className="input-field"
    placeholder="Enter your email-id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {email && !/\S+@\S+\.\S+/.test(email) && <p className="validation-alert">Enter a valid email address.</p>}
            <h5>Mobile Number*</h5>
            <div className="phone-input-container">
                  {userType === 'RETAILER' ? (
                  <select value="+91" disabled>
                    <option value="+91">(+91) India</option>
                  </select>
                ) : (
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
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
                )}
                <input
                  type="text"
                  className="input-field"
    placeholder="Enter your mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              {phoneNumber && phoneNumber.length !== 10 && <p className="validation-alert">Mobile number must be exactly 10 digits.</p>}
              {phoneNumber && !/^\d+$/.test(phoneNumber) && <p className="validation-alert">Mobile number must contain only digits.</p>}
            
        </div>
        {( /\S+@\S+\.\S+/.test(email) && /^\d{10}$/.test(phoneNumber)) ? (
      <button onClick={handleEmailVerification}>Send Verification Code</button>
    ) : (
      <button disabled>Send Verification Code</button>
    )}
        </>
      )}
      {verificationSent && !registrationCompleted && (
        <>
        <p>{message}</p>
        <div className="user-details-grid">
        <div className="grid-item">
            <h5>Username*</h5>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid-item">
          <h5>Verify email-id*</h5>
            <input
              type="text"
              className="input-field"
              placeholder="Please enter e-mail verification code"
              value={emailVerificationCode}
              onChange={(e) => setEmailVerificationCode(e.target.value)}
            />
            </div>
            
            <div className="grid-item">
              <h5>Verify mobile number*</h5>
            
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your OTP received through SMS"
                  value={phoneNumberVerificationCode}
                  onChange={(e) => setPhoneNumberVerificationCode(e.target.value)}
                />
                </div>
                {userType === "RETAILER" && verificationSent && !registrationCompleted && (
            <>
                <div className="grid-item">
                <h5>Shop Name*</h5>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your Shop/Company name"
                  value={companyBrand}
                  onChange={(e) => setcompanyBrand(e.target.value)}
                />
                </div>
                <div className="grid-item">
                <h5>Shop Address*</h5>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your Shop/Company address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
                </div>
                <div className="grid-item">
                <h5>City*</h5>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your City*"
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                />
                </div>
                <div className="grid-item">
                <h5>Pincode*</h5>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your city pincode"
                  value={companyPincode}
                  onChange={(e) => setCompanyPincode(e.target.value)}
                />
                </div>
                <div className="grid-item">
                <h5>State*</h5>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your State"
                  value={companyState}
                  onChange={(e) => setCompanyState(e.target.value)}
                />
                </div>
                </>
            
                  )}
           
              <div className="grid-item">
            <h5>Password*</h5>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field password-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="show-password-button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {password.length < 7 && <p className="validation-alert">Password must be at least 7 characters long.</p>}
            {password && (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) && <p className="validation-alert">Password must contain at least 1 letter and 1 number.</p>}
          </div>

          </div>
          {(userType==="CUSTOMER" && password && username && emailVerificationCode && phoneNumberVerificationCode && password.length >= 7 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) || (userType==="RETAILER" && password && username && companyBrand && phoneNumberVerificationCode && emailVerificationCode && companyAddress && companyCity && companyPincode && companyState && password.length >= 7 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) ? (
          <button onClick={handleRegistration}>Register</button>
        ):(
          <button disabled>Register</button>
        )}
          {retryCount < 4 && (
            <button onClick={handleRetryVerification}>Resend Verification Code</button>
          )}
        </>
      )}
      {registrationCompleted && userType==="CUSTOMER" && (
        <div>
          <h2>Registration completed!</h2>
          <button onClick={handleGoToLogin}>SIGN IN</button>
        </div>
      )}
        
          {registrationCompleted && userType==="RETAILER" &&(
        <div>
        <h2>Registration completed!</h2>
        <p>We are validating your details to avoid spams. Your account will be activated shortly.</p>
        <p>Until then you will not be able to SIGN IN. Once activated we will inform you trough e-mail and SMS</p>
        </div>
      )}
    </div>
      </div>
    </div>
  );
}

export default Signup;
