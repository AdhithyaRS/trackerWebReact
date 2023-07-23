import React , { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate  , useLocation} from "react-router-dom";


function Dashboard() {
  const location = useLocation();
  const username = location.state?.username;
  const email = location.state?.email;
  console.log(email);
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("In fetch "+email);
      try {
        const response = await axios.get(`http://localhost:8080/dashboard/${email}`);
        setProducts(response.data);
        console.log(response.data);
        console.log("ID of first product : "+response.data[0]._id);
      } catch (error) {
        console.error("Error occurred while fetching products:", error);
        if (error.response && error.response.status === 401) {
          // Unauthorized status
          // You can handle unauthorized status here, such as redirecting to login page
          alert("Unauthorized, please login.");
          navigate("/");
        }
      }
    };

    
    fetchProducts();
  }, [email]);

  return (
    <div>
      <h2>Welcome to the Dashboard, {username}!</h2>
      <div>
        <h3>Products associated with {username}:</h3>
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h4>Name: {product.productName}</h4>
              <h4>Type: {product.type}</h4>
              <h4>Location: {product.location}</h4>
              <h4>Quantity: {product.quantity}</h4>
              </li>
          ))}
        </ul>
      </div>
      <p>GPS Tracking,etc coming soon.....</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;



