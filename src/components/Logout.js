import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const [message, setMessage] = useState();
  // const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      // Send logout request to the server
      await axiosInstance.post("/user/logout");

      // Clear the token and navigate to login page
      localStorage.removeItem("token");
      localStorage.removeItem("AdminId")
      localStorage.removeItem("createdBy")
      window.location.reload()
    } catch (error) {
      console.error("Logout failed:", error);
      setMessage("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <ul>
        <li >
        <a href="/user/signin">
        <button onClick={handleLogOut}>LogOut</button>
        </a>
        </li>
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Logout;
