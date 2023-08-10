
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showVerificationSend, setShowVerificationSend] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPasswrod] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`https://localhost:8443/login`, {
        email: email,
        password: password,
      });

      const responseData = response.data;

      // Proceed further based on the response data
      if (responseData.success) {
        
        const username = responseData.userName;
        // If the login was successful, redirect to the dashboard
        console.log(email);
        navigate(`/dashboard`,{ state: { username: username, email: email } });
      } else {
        const messageFromBackend = responseData.message;
        // If the login failed, show an appropriate alert message based on the backend message
        alert(messageFromBackend);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      alert("An error occurred during login. Please try again later.");
    }
  };

  const handleSignup = async () => {
    navigate("/signup");
  };

  const handlePasswordReset = () => {
    setShowResetPassword(true);
  };

  const handleEmailVerification = async () => {
    try {
      const response = await axios.post("https://localhost:8443/passwordreset", {
        email: email,
        reset: true,
      });
      const responseData = response.data;
      if (responseData.success) {
        setVerificationSent(true);
        setShowVerificationSend(false);
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error("Error occurred during email verification:", error);
      alert("An error occurred during email verification. Please try again later.");
    }
  };

  const handleRetryVerification = () => {
    setVerificationSent(false);
    setShowVerificationSend(true);
    setRetryCount(retryCount + 1);
  };

  const handleVerificationCodeSubmit = async () => {
    try {
      const response = await axios.post("https://localhost:8443/verifycode", {
        email: email,
        password: newPassword,
        verificationCode: verificationCode,
      });
      const responseData = response.data;
      if (responseData.success) {
        alert(responseData.message);
        setVerificationSent(false);
        setShowResetPassword(false);
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error("Error occurred during verification code submission:", error);
      alert("An error occurred during verification code submission. Please try again later.");
    }
  };

  return (
    <div>
      {!showResetPassword && <h2>Login Page</h2>}
      {!showResetPassword ? (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h5 style={{ marginRight: "10px" }}>Username*</h5>
            <input
              type="text"
              placeholder="Email-ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h5 style={{ marginRight: "10px" }}>Password*</h5>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleSignup}>SIGN UP</button>
          <button onClick={handleLogin}>SIGN IN</button>
          <p>
            If you have forgotten your password, please click the button below
            to reset it:
          </p>
          <button onClick={handlePasswordReset}>Reset Password</button>
        </>
      ) : (
        <>
          {showVerificationSend && (
            <>
              <h2>Reset Password</h2>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h5 style={{ marginRight: "10px" }}>Email ID*</h5>
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
  );
}

export default Login;

// import axios from "axios";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const navigate = useNavigate();
//   const [showResetPassword, setShowResetPassword] = useState(false);
//   const [verificationSent, setVerificationSent] = useState(false);
//   const [showVerificationSend, setShowVerificationSend] = useState(true);
//   const [retryCount, setRetryCount] = useState(0);
//   const [verificationCode, setVerificationCode] = useState("");

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post(`https://localhost:8443/login`, {
//         email: email,
//         password: password,
//       });
  
      
//       const responseData = response.data;
  
//       //const usernameFromBackend = responseData.userName;
//       const messageFromBackend = responseData.message;
//       const username= responseData.username;
//       // Proceed further based on the response data
//       if (responseData.success) {
        
        
//         // If the login was successful, redirect to the dashboard
//         navigate(`/dashboard/${username}`);
//       } else {
//         // If the login failed, show an appropriate alert message based on the backend message
//         alert(messageFromBackend);
//       }
//     } catch (error) {
//       console.error("Error occurred during login:", error);
//       alert("An error occurred during login. Please try again later.");
//     }
//   };
//   const handleSignup = async () => {
//     navigate("/signup");
//   };
//   const handlePasswordReset = () => {
//     setShowResetPassword(true);
//   };

//   const handleEmailVerification = async () => {
//     try {
//       // Send a POST request to the backend to initiate the email verification process
//       const response = await axios.post("https://localhost:8443/passwordreset", {
//         email: email,
//         reset: true,
//       });
//       const responseData = response.data;
//       // Display a success message and update the state
//       if (responseData.success) {
//         setVerificationSent(true);
//         setShowVerificationSend(false);
//       } else {
//         alert(responseData.message);
//       }
      
//     } catch (error) {
//       console.error("Error occurred during email verification:", error);
//       // Display an error message if the request fails
//     }
//   };
//   const handleRetryVerification = () => {
//     setVerificationSent(false);
//     setShowVerificationSend(true);
//     setRetryCount(retryCount + 1);
//   };

//   const handleVerificationCodeSubmit = async() => {
//     try {
//       // Send a POST request to the backend to initiate the email verification process
//       const response = await axios.post("https://localhost:8443/verifycode", {
//         email: email,
//         password: password,
//         verificationCode: verificationCode
//       });
//       const responseData = response.data;
//       // Display a success message and update the state
//       if (responseData.success) {
//         setVerificationSent(true);
//       } else {
//         alert(responseData.message);
//       }
      
//     } catch (error) {
//       console.error("Error occurred during email verification:", error);
//       // Display an error message if the request fails
//     }
//   }; 

//   // return (
    
      
//   //    <div>
//   //     <h2>Login Page</h2>
//   //      <div style={{ display: "flex", alignItems: "center" }}>
//   //       <h5 style={{ marginRight: "10px" }}>Username*</h5>
//   //       <input
//   //         type="text"
//   //         placeholder="Email-ID"
//   //         value={email}
//   //         onChange={(e) => setEmail(e.target.value)}
//   //       />
//   //      </div>
//   //      <div style={{ display: "flex", alignItems: "center" }}>
//   //       <h5 style={{ marginRight: "10px" }}>Password*</h5>
//   //       <input
//   //         type="password"
//   //         placeholder="Password"
//   //         value={password}
//   //         onChange={(e) => setPassword(e.target.value)}
//   //       />
        
//   //      </div>
      
//   //      <button onClick={handleSignup}>SIGN UP</button><button onClick={handleLogin}>SIGN IN</button>
//   //      <p>If you have forgotten your password, please click the button below to reset it:</p>
//   //      <button onClick={handlePasswordReset}>Reset Password</button>
//   //     </div>
      
    

      
//   // );
//   return (
//     <div>
//       {!showResetPassword && <h2>Login Page</h2>}
//       {!showResetPassword ? (
//         <>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <h5 style={{ marginRight: "10px" }}>Username*</h5>
//             <input
//               type="text"
//               placeholder="Email-ID"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <h5 style={{ marginRight: "10px" }}>Password*</h5>
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <button onClick={handleSignup}>SIGN UP</button>
//           <button onClick={handleLogin}>SIGN IN</button>
//           <p>
//             If you have forgotten your password, please click the button below
//             to reset it:
//           </p>
//           <button onClick={handlePasswordReset}>Reset Password</button>
//         </>
//        ) : ( 
//         <>
//         {showVerificationSend (
//         <>
//           <h2>Reset Password</h2>
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <h5 style={{ marginRight: "10px" }}>Email ID*</h5>
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <button onClick={handleEmailVerification}>
//             Send Verification Code
//           </button>
//         </>
//        )}
//        </>
//       )}
//       {verificationSent && (
//             <>
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <h5 style={{ marginRight: "10px" }}>Verification Code*</h5>
//               <input
//                 type="text"
//                 placeholder="Enter verification code"
//                 value={verificationCode}
//                 onChange={(e) => setVerificationCode(e.target.value)}
//               />
//             </div>
//             <button onClick={handleVerificationCodeSubmit}>Submit</button>
//             {retryCount < 3 && (
//               <button onClick={handleRetryVerification}>
//                 Resend Verification Code
//               </button>
//             )}
//           </>

//       )}
//     </div>
//   );
// }

// export default Login;