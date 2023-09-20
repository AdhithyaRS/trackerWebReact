
import axios from "axios";
import React, { useState , useEffect} from "react";
import { useNavigate, Link  } from "react-router-dom";
import logo from "../Images/Logo/logo.png";
import "./SignIn.css";
import { FaHome } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("CUSTOMER");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPasswrod] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [reset, setReset] = useState(false);
  const [disableResend, setDisableResend] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  

  const handleLogin = async () => {
    setMessage("");
    let postData = {
      password: password,
      userTypeCustom: userType,
    };
  
    if (/\S+@\S+\.\S+/.test(id)) {
      postData.email = id;
    } else if (/^\d{10}$/.test(id)) {
      postData.phoneNumber = countryCode + id;
    }
    try{
      const response = await axios.post(`http://localhost:8080/signIn`, postData,{
        withCredentials: true,
      });

      const responseData = response.data;
      if (responseData.success) {
        setMessage("");
        setShowResetPassword(true);
        setCountryCode("+91");
        setId("");
        setUserType("CUSTOMER");
        setPassword("");
        setNewPasswrod("");
        setRetypePassword("");
        setReset(false);
        if (userType === "CUSTOMER") {
          navigate(`/`);
        } else {
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

  const handlePasswordReset = () => {
    setMessage("");
    setVerificationSent(false);
    setShowResetPassword(true);
    setCountryCode("+91");
    setId("");
    setUserType("CUSTOMER");
    setPassword("");
    setNewPasswrod("");
    setRetypePassword("");
    setReset(false);
  };

  useEffect(() => {
    console.log(userType);
    console.log(reset);
    if (reset) {
      handleEmailVerification();
  }
  }, [reset]);
  const handleEmailVerification = async () => {
    setMessage("");
    let postData = {
      userTypeCustom: userType,
      reset: reset,
    };
  
    if (/\S+@\S+\.\S+/.test(id)) {
      postData.email = id;
    } else if (/^\d{10}$/.test(id)) {
      postData.phoneNumber = countryCode + id;
    }
    try{
      const response = await axios.post(`http://localhost:8080/signIn/passwordreset`, postData,{
        withCredentials: true,
      });
      const responseData = response.data;
      if (responseData.success && responseData.message === "Reset") {
        // Prompt user with a confirmation dialog
        const userWantsToReset = window.confirm("Password reset process already on-going!! Do you want to cancel the old session?");
        
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
        setReset(false);
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
    setDisableResend(true);
    setMessage("");
    let postData = {
      userTypeCustom: userType,
    };
  
    if (/\S+@\S+\.\S+/.test(id)) {
      postData.email = id;
    } else if (/^\d{10}$/.test(id)) {
      postData.phoneNumber = countryCode + id;
    }
    try{
      const response = await axios.post(`http://localhost:8080/signIn/sendCode`, postData,{
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
        console.error("Error occurred during registration:", error.response.data);
  
        switch (error.response.status) {
          case 401: // Unauthorized
            if (error.response.data === "Token has expired") {
              setMessage("Your session has expired. Please start over again.");
            } else {
              setMessage("Unauthorized access. Please sign up.");
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

  const handleRetryVerification = () => {
    
    if (retryCount < 4) {
      sendCodeToBackend();
  } else {
      alert("Maximum tries reached!! Please check your email-id/Mobile number/Country code and try again");
      setVerificationSent(false);
      setNewPasswrod("");
      setRetypePassword("");
      setPassword("");
      setVerificationCode("");
      setMessage("");
      setRetryCount(0);
  }
  };

  const handleVerificationCodeSubmit = async () => {
    setMessage("");
    let postData = {
      verificationCode: verificationCode,
    };
  
    if (/\S+@\S+\.\S+/.test(id)) {
      postData.email = id;
    } else if (/^\d{10}$/.test(id)) {
      postData.phoneNumber = countryCode + id;
    }
    try{
      const response = await axios.post(`http://localhost:8080/signIn/verifycode`, postData,{
        withCredentials: true,
      });
      const responseData = response.data;
      if (responseData.success) {
        setMessage(responseData.message);
        let postData = {
          password : newPassword,
          userTypeCustom: userType,
        };
      
        if (/\S+@\S+\.\S+/.test(id)) {
          postData.email = id;
        } else if (/^\d{10}$/.test(id)) {
          postData.phoneNumber = countryCode + id;
        }
        try{
          const response = await axios.post(`http://localhost:8080/signIn/changePassword`, postData,{
            withCredentials: true,
          });
          const responseData = response.data;
          if (responseData.success) {
            alert(responseData.message);
            setShowResetPassword(false);
          } else {
            setMessage(responseData.message);
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
                } else {
                  setMessage("Unauthorized access. Please sign up.");
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
        setMessage(responseData.message);
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
            } else {
              setMessage("Unauthorized access. Please sign up.");
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
  const handleCancelReset = () => {
    if(verificationSent){
      setVerificationSent(false);
      setVerificationCode("");
      setPassword("");
      setNewPasswrod("");
      setRetypePassword("");
      setRetryCount(0);
      setMessage("");
    }else if(showResetPassword){
      setId("");
      setCountryCode("+91");
      setUserType("CUSTOMER");
      setShowResetPassword(false);
      setMessage("");
    }
    
  };
  
  const handleToggleUserType = () => {
    if(!verificationSent){
      setUserType(userType === "CUSTOMER" ? "RETAILER" : "CUSTOMER");
      setCountryCode("+91");
      setId("");
      setMessage("");
      setNewPasswrod("");
      setPassword("");
      setRetypePassword("");
      setVerificationCode("");
    }
    //console.log(userType);
  };

  useEffect(() => {
    let timer;
    if (disableResend) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setDisableResend(false);
            return 60;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [disableResend]);

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
            
          </div>
          <p>{message}</p>
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
                className="input-field"
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
              <button className="login-button" onClick={handleLogin} disabled={!((/\S+@\S+\.\S+/.test(id) || /^\d{10}$/.test(id)) && countryCode) || password.length < 7 ||  !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)}>SIGN IN</button>
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
                disabled={verificationSent}
              />
              <span className="user-type-toggle-slider"></span>
            </label>
            
            <span className="user-type-toggle-label">RETAILER</span>
            
          </div>   
          <p>{message}</p> 
          {!verificationSent ? (
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
                {( !/\S+@\S+\.\S+/.test(id) && !/^\d+$/.test(id) && id ) && <p className="validation-alert">Enter valid emai-id.</p>}
                {(countryCode==="" && /^\d{10}$/.test(id)) && <p className="validation-alert">Select country code</p>}
              </div>
              <button className="login-button" onClick={handleEmailVerification} disabled={!((/\S+@\S+\.\S+/.test(id) || /^\d{10}$/.test(id)) && countryCode)}>Send Verification Code</button>
            </>
          ):(
              <>
              <div className="login-input">
              <h5>Verification Code*</h5>
              <input
              type="text"
              className="input-field"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            {(verificationCode && !/^\d{6}$/.test(verificationCode)) && <p className="validation-alert">Enter 6 digit verification code</p>}
            </div>
                <div className="login-input">
                <h5>New Password*</h5>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPasswrod(e.target.value)}
              />
              <button className="show-password-button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {newPassword && newPassword.length < 7 && <p className="validation-alert">Password must be at least 7 characters long.</p>}
            {newPassword && (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) && <p className="validation-alert">Password must contain at least 1 letter and 1 number.</p>}
              </div>
              <div className="login-input">
                <h5>Re-type Password*</h5>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Re-type password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
              />
              <button className="show-password-button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {newPassword!==retypePassword && <p className="validation-alert">Password must match.</p>}
              </div>
              {(/^\d{6}$/.test(verificationCode) && newPassword.length >= 7 && /[A-Za-z]/.test(newPassword) && /[0-9]/.test(newPassword) && newPassword===retypePassword) ? (
          <button onClick={handleVerificationCodeSubmit}>Submit</button>
        ):(
          <button disabled>Submit</button>
        )}
                {retryCount < 5 && (
                  <button onClick={handleRetryVerification} disabled={disableResend}>
                  {disableResend ? `Resend Verification Code (${remainingTime}s)` : 'Resend Verification Code'}
                </button>
                
                  )}
              </>
            )}
        </>
      )}
</div>
    </div>
    </div>
  );
}

export default Login;
