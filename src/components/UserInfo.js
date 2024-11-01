import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // Import the Axios instance

const UserInfo = () => {
    const{id}=useParams();
    const[user,setUser]=useState(null);

    useEffect(()=>{
      const fetchUser= async()=>{
        try{
          const response = await axiosInstance.get(`/user/${id}`);
          setUser(response.data.users);
        }catch(error){
          console.log("Error fetching user:", error)
        }
      }
      fetchUser()
    },[id])

    if (!user) return <p>Loading user data...</p>;

  return (
        <div>
            <h1>User Info</h1>
            <p>Name: {user.firstname}</p>
            <p>Email: {user.email}</p>
            {/* Display other user details as needed */}
        </div>
  )
}

export default UserInfo
