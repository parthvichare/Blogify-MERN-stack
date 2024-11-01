import React, { useState } from 'react';
import axiosInstance from '../axiosInstance'; // Import the Axios instance
import { useNavigate, useParams } from 'react-router-dom';

const Signup = () => {
  const[message,setMessage]=useState('');
  const [formData, setFormData] = useState({
    firstname: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData,[e.target.name]:e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Send form data as JSON
        const response = await axiosInstance.post('/user/api/signup', formData,{
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        const { message, user, userexist } = response.data;

        if (userexist) {
            setMessage(userexist); // Show the user already exists message
        } else {
            setMessage(message); // Show success message
            const userId = user._id; // Access the user ID
            navigate(`/user/signIn`); // Navigate to user page
        }
    } catch (err) {
        // Handle the error based on the response status
        if (err.response && err.response.status === 400) {
            setMessage(err.response.data.userexist || 'An error occurred.');
        } else {
            setMessage('An error occurred while creating the account.'); // General error message
        }
    }
};


  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
