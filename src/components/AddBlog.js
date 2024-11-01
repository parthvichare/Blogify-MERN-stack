// import React,{useState} from 'react'
// import axiosInstance from '../axiosInstance'
// import { useNavigate, useParams } from 'react-router-dom';

// const AddBlog = () => {
//     const userId= localStorage.getItem("userInfo")
//     const[blog,setBlogs]=useState({
//         title:"",
//         body:""
//     })
//     const[error,setError]=useState(null)

//     const navigate = useNavigate(); // Initialize navigate
    
//     const handleChange=(e)=>{
//         const{name,value}=e.target
//         setBlogs({...blog,
//                   [name]:value})
//     }

//     const blogdata={
//         ...blog, 
//         createdBy:userId
//     }
    
//     const handleSubmit=async(e)=>{
//         e.preventDefault()

//         try{
//             const response = await axiosInstance.post("/blog/api/addblog", blogdata)
//             const{blog,_id}=response.data
//             console.log(blog)
//             const blogId= blog._id
//             navigate(`blog/${blogId}`)
//         }catch(error){
//             setError(error)
//         }
        
//     }

//   return (
//     <div>
//         <form onSubmit={handleSubmit}>
//             <input type="text" name="title" placeholder="title" onChange={handleChange}/>
//             <input type="text" name="body" placeholder="body" onChange={handleChange}/>
//             <button type="submit">Submit</button>
//         </form>
//     </div>
//   )
// }

// export default AddBlog














import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const AddBlog = () => {
    const [blogs, setBlog] = useState({
        title: "",
        body: ""
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate(); // Initialize navigate

    const handleChange = (e) => {
        setBlog({ ...blogs, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Retrieve userId from localStorage here before sending the request
        const userId = localStorage.getItem("AdminId");
        const token= localStorage.getItem("token")
        // Create a new blog object with createdBy included
        const blogData = {
            ...blogs,
            createdBy: userId // Add createdBy field here
        };
        if(userId && token){
            try {
                const response = await axiosInstance.post("/blog/api/addblog", blogData);
                const { message, blog } = response.data;
                setMessage(message);
                console.log(blog);
                const blogId = blog._id
                navigate(`/blog/${blogId}`)
            } catch (error) {
                setError(error.response ? error.response.data.Error : "Something went wrong!");
            }
        }else{
            setMessage("You're not signed in. Please log in to add a new blog post!");
            // navigate("/user/signin")
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
                <input type="text" name="body" placeholder="Description" onChange={handleChange} required />
                <button type="submit">Add Blog</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error messages */}
        </div>
    );
};

export default AddBlog;
