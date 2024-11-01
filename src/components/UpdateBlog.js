import React,{useState,useEffect} from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import axiosInstance from '../axiosInstance'

const UpdateBlog = () => {
    const{id}=useParams()
    const adminId=localStorage.getItem("AdminId")
    const navigate=useNavigate()
    console.log(id)
    const[updateblog,setUpdateBlog]=useState({
        title:"",
        body:""
    })
    const[updatedblog,setUpdatedBlog]=useState(null)
    const[error,setError]=useState(null)
    const[message,setMessage]=useState(null)

    const handleChange=(e)=>{
        // const {title,body}=[e.target.name]
        setUpdateBlog({...updateblog, [e.target.name]:e.target.value })
        console.log(e.target.value)
        console.log(updateblog)
    }

    const handleSubmit=async(e)=>{
        if(adminId){
          e.preventDefault()
          try{
            const response= await axiosInstance.patch(`/blog/updateBlog/${id}`,updateblog)
            const{successmessage}=response.data
            setMessage(successmessage)
            navigate(`/blog/${id}`)
            // window.location.reload()
          }catch(error){
            setError(error.message)
          }
        }else{
            setMessage("You are Not Created this Blog")
        }
    }

    console.log(updatedblog)

    useEffect(()=>{
        const fetchBlog=async ()=>{
            try{
                const response= await axiosInstance.get(`/blog/${id}`)
                const {blog}=response.data
                setUpdateBlog({...blog, title:blog.title,body:blog.body})
            }catch(error){
                setError(error.message)
            }
        }
        fetchBlog()
    },[id])



    if(!updateblog){
        return <div>Loading Blog...</div>
    }
    if(error){
        return <div>{error}</div>
    }
  return (
    <div>
        <p>
        {`Hello ${id}`}
        </p>
        <form onSubmit={handleSubmit}>
         <input type="text" name="title" placeholder="Title" value={updateblog.title} onChange={handleChange}   required />
         <input type="text" name="body"  placeholder="Body"   value={updateblog.body} onChange={handleChange}   required />
         <button type="submit">Update Blog</button>
        </form>
        {error&& <p>{error.message}</p>}
        {message && <p>{message}</p>}
    </div>
  )
}

export default UpdateBlog