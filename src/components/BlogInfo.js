import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { set } from 'mongoose';

const BlogInfo = () => {

    const adminId=localStorage.getItem("AdminId")
    const tokenId=localStorage.getItem("token");
    

    const[isvisible,setIsVisible]=useState(false);

    const [AdmindelComment, setAdminDelComment] = useState(false);
    // const [UserdelComment,setUserdelComment]=useState(true);

    const [blogs, setBlog] = useState();
    // console.log("Blog1",blogs)
    const [error, setError] = useState(null);
    const { id } = useParams();

    const[comment,setComment]=useState(null)
    const[commentdata,setCommentdata]=useState(null)
    const[message,setMessage]=useState(null)

    // console.log("Comment",comment)
    // console.log("Comment data",commentdata)


    const navigate = useNavigate(); // Initialize navigate



    console.log(blogs)
    // console.log(userId)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axiosInstance.get(`/blog/${id}`);
                const{blog}=response.data
                setBlog(blog); // Assuming `response.data.blog` exists
                const createdBy=blog.createdBy._id
                localStorage.setItem("createdBy",createdBy)
            } catch (error) {
                setError(error.message); // Set the error message
            }
        };
        fetchBlog();
    }, [id]);



    // Delete Show and Hide based on the userID
    useEffect(()=>{
      const createdBy=localStorage.getItem("createdBy")
      if(createdBy!==adminId){
          setIsVisible(false)
      }else{
          setIsVisible(true)
      }
    })

    // Handle Change based on the Input
    const handleChange=(e)=>{
      console.log(e.target.value)
      setComment({...comment, [e.target.name]:e.target.value})
    }
    
    const commentData= {
      ...comment,
      blogId:id,
      user:adminId,
      tokenId:tokenId
  }

    // //Handle Comment Submission!
    const handleCommentSubmit=async(e)=>{
      e.preventDefault()
      const blogId= blogs._id
      // const createdBy=localStorage.getItem("createdBy")
      if(adminId){
        try{
          const response= await axiosInstance.post(`/blog/comment/${blogId}`, commentData)
          const{message}=response.data
          window.location.reload();
          setMessage(message)
        }catch(error){
          console.log(`Error is ${error}`)
        }
      }else{
        setMessage("LogIn for Making comment")
      }
    }

    //Fetching Comments of All user
    useEffect(()=>{
      const fetchComment=async()=>{
        try{
          const response= await axiosInstance.get(`/blog/comment/${id}`)
          const{commentInfo}=response.data
          setCommentdata(commentInfo)
          console.log("Comment",commentdata)
        }catch(error){
          console.log(`Error is ${error}`)
        }
      }
      fetchComment()
    },[id])

    // console.log('All comment',commentdata)

    
    // //Delete Blog according to User created Blog
    const handledeleteblog = async (id) => {
      const createdBy= localStorage.getItem("createdBy")
      // console.log(createdBy)
      if(adminId===createdBy){
        try {
          setIsVisible(true)
          const response = await axiosInstance.delete(`/blog/${id}`);
          const { message } = response.data;
          console.log(blogs)
          setMessage(message); // Set success message
          setBlog((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
          navigate('/'); // Redirect to home page
        } catch (error) {
          setError(error.message);
        }
      }else{
        setIsVisible(false)
        console.log("You are not created this Blog")
      }
    };

    const DeleteCommentReq = async (commentId) => {
      try {
        const response = await axiosInstance.delete(
          `/blog/comment/${commentId}`
        );
        const { message } = response.data;
        setMessage(message);
        window.location.reload();
        // setComment((prevComments)=>prevComments.filter((comment)=>comment.id!==id));
      } catch (error) {
        console.log("Error", error);
      }
    };


    //Delete Comment
    const handledeleteComment = (createdBy, commentId) => {
      //Admin have access of deleting comments of user
      if (blogs.createdBy._id === adminId || adminId === createdBy) {
        DeleteCommentReq(commentId);
      }else{
        console.log("You can not Access")
      }
      return createdBy
    }
  

    useEffect(()=>{
      const createdById = () =>{
        if (blogs){    //Admin Delete button Access
          if(blogs.createdBy._id===adminId){
            setAdminDelComment(true)
          }
        }else{
          setAdminDelComment(false)
        }
        if(commentdata){
          for(let i=0;i<commentdata.length;i++){
            const comment=commentdata[i]
            if(comment.createdBy._id===adminId){
              console.log("All",comment)                    //User comment delete button Access
              console.log("Hello Comments")
              setAdminDelComment(true)
            }
          }
        }
      }
      createdById()
    })

    // const handleUpdateChange=(e)=>{
    //   setUpdateBlog({...updateBlog,[e.target.name]:e.target.value})
    // }

    // Edit Blog
    const handleEditBlog=async(blogId)=>{
      try{
        const response = await axiosInstance.patch(`/blog/update/${id}`)
        const{updateMessage}= response.data
        setMessage(updateMessage)
        setMessage(`Hello ${blogId}`)
        navigate(`/updateBlog/${blogId}`)
      }catch(error){
        setError(error.message)
      }
    }

    
    if (error) {
        return <div>Error: {error}</div>; // Display the error if it exists
    }

    if(!blogs){
      return <div>Loading Blog...</div>
    }

        
    if(!commentdata){
      return <div>Loading Comment...</div>; // Display loading until the blog is fetched
    }


    return (
      <div>
        <div>
          <h1>Blog Created By {blogs.createdBy.firstname}</h1>
          <h1>{blogs.title}</h1>
          <p>{blogs.body}</p> {/* Display body content if it exists */}
          <div>
            {/* <button onClick={() => handledeleteblog(blogs._id)}>Delete</button> */}
            {isvisible ? (
              <div>
              <button onClick={() => handledeleteblog(blogs._id)}>
                Delete
              </button>
              <a href={`/update/${id}`}>
              <button onClick={()=>handleEditBlog(blogs._id)}>Edit</button>
              </a>
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* Comment Submission */}
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              name="content"
              onChange={handleChange}
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Comment Content */}
        <div>
          {commentdata ? (
            commentdata.map((item, index) => (
              <ul>
                <p>{item.content}</p>
                <p >Comment By {item.createdBy.email}</p>
                {/* <button
                  onClick={() =>
                    handledeleteComment(item.createdBy._id, item._id)
                  }
                >
                  Delete Comment
                </button> */}

                {AdmindelComment ? (
                  <div>
                  <button
                    onClick={() =>
                      handledeleteComment(item.createdBy._id, item._id)
                    }
                  >
                    Delete Comment
                  </button>
                  </div>
                ) : (
                  <></>
                )}

              </ul>
            ))
          ) : (
            <h1>No comment found yet</h1>
          )}
          {error&& <p>{error}</p>}
        </div>
      </div>
    );
};

export default BlogInfo;






{/* <div>
<form onSubmit={handleCommentSubmit}>
  <input
    type="text"
    name="content"
    onChange={handleChange}
    required
  />
  <button type="submit">Submit</button>
</form>
{isvisible ? (
    <button onClick={() => handledeleteblog(blogs._id)}>
      Delete
    </button>
) : (
  <></>
)}
</div> */}
// <div>
// <div>
//   {commentdata ? (
//     commentdata.map((item, index) => (
//       <ul>
//         <p>{item.content}</p>
//         <p>Comment By {item.createdBy.email}</p>
//         {/* <button onClick={()=>handledeleteComment(item.createdBy._id)}>
//           Delete Comment
//         </button> */}
//       </ul>
//     ))
//   ) : (
//     <h1>No comment found yet</h1>
//   )}
// </div>
// </div>
// {message && <p>{message}</p>}
// {error && <p>{error}</p>}



// import React,{useState,useEffect} from 'react'
// import { useParams } from 'react-router-dom';
// import axiosInstance from '../axiosInstance';

// const blogInfo = () => {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const{id}=useParams();
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const[blog,setBlog] = useState(null);
//     console.log("Blog",blog)

//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     useEffect(()=>{
//       const fetchBlog=async()=>{
//                 try{
//                     const response = await axiosInstance.get(`blog/${id}`)
//                     // const{blogs}=response.data
//                     setBlog(response.data.blogs)
//                 }catch(error){
//                     console.log("Error fetching user:", error)
//                 }
//          }
//       fetchBlog()
//     },[id])
//     if (!blog) {
//         return <div>Loading...</div>; // Display loading message while fetching
//     }
//   return (
//     <div>
//         Add
//         <h1>{blog.title}</h1>
//     </div>
//   )
// }

// export default blogInfo




// POST request :- Submit the comment and Stored in database from POST request 
// GET request   :- Retreive the commment fro particular id on the post