import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    email: '',
    password: '',
  });

  console.log(formData)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('firstname', formData.firstname);
    data.append('email', formData.email);
    data.append('password', formData.password);


    try {
      const response = await axios.post('http://localhost:8000/api/signUp', data);
      window.location.href = `/user_profile/${response.data._id}`;
    } catch (err) {
      console.error('Error creating account:', err);
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
    </div>
  );
};

export default Signup;
