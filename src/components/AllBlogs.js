import React,{useState,useEffect} from 'react'
import axiosInstance from '../axiosInstance'

const AllBlogs = () => {
    const[blog,setBlog]=useState(null)
    const[error,setError]=useState(null)

    console.log(blog)


    useEffect(()=>{
      const fetchBlog=async()=>{
        try{
            const response= await axiosInstance.get("/blog/api/blogs")
            // const{body}=response.data
            setBlog(response.data.blogs)
            // setBlog(response.data.)
        }catch(error){
            setError(error)
        }
    }
    fetchBlog()
    },[])


    // const blogId=blog.id
    // console.log(blogId)

    if(!blog){
      return <p>Loading....</p>
    }

    if(blog.length===0){
      return <p>No blogs Available</p>
    }

    return (
      <div>
        {blog ? (
          blog.map((item, index) => (
            <div key={index}>
            <p>Blog Title: {item.title}</p>
            <p>Blog Content: {item.body}</p>
            <a href={`/blog/${item._id}`}>
              <button>
                View
              </button>
            </a>
            <p>_________________________________________________________________________________________________________</p>
          </div>
          ))
        ) : (
          <p>No Blogs Available</p>
        )}
      </div>
    );

  }

export default AllBlogs