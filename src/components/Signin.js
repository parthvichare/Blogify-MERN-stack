import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Import the Axios instance
import { useNavigate, useParams } from 'react-router-dom';

const Signin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const { id } = useParams(); // Extract id from URL parameters
    const [Id, setId] = useState(null); // Initialize Id as null
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [message, setMessage] = useState();
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/api/data/`); // Use id in the API call
                const { message } = response.data;
                setData(message);
            } catch (error) {
                setError(error.response?.data?.error || 'Failed to fetch data');
            }
        };
        if (error) { // Check if Id is not null before logging
            console.log("Blog");
            fetchData(); // Call fetchData
        }
    },[error]); // Dependency array includes Id


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/user/api/signIn", formData);
            const { token, Loginstatus, user, error } = response.data;
            if (!user) {
                setError(error);
            } else {
                localStorage.setItem("token", token);
                localStorage.setItem("AdminId",user.id)
                const userId = user.id;
                const intUserId = parseInt(userId, 10); // Base 10
                setId(intUserId); // This will trigger the useEffect

                setMessage(Loginstatus);
                navigate(`/user/${userId}`);
                window.location.reload()
            }
        } catch (error) {
            setError(error.response?.data?.error || 'An error occurred during login');
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Sign In</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Signin;
