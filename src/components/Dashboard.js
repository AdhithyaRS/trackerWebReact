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
    // You can implement a logout functionality here if needed.
    // For this example, we are simply redirecting back to the login page.
    navigate("/");
  };
  // Get the username from the URL query parameter using useParams
  

  // State to hold the list of products
  const [products, setProducts] = useState([]);

  // Use useEffect to fetch the products when the component mounts or the username changes
  useEffect(() => {
    // Define an async function to fetch the products
    const fetchProducts = async () => {
      console.log("In fetch "+email);
      try {
        const response = await axios.get(`http://localhost:8080/dashboard/${email}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error occurred while fetching products:", error);
      }
    };

    // Call the fetchProducts function
    fetchProducts();
  }, [email]); // The effect will re-run whenever the uname changes

  return (
    <div>
      <h2>Welcome to the Dashboard, {username}!</h2>
      <div>
        <h3>Products associated with {username}:</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h4>Name: {product.name}</h4>
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



