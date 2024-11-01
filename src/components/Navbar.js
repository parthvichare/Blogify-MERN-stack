import React,{useState} from 'react';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';


const Navbar = () => {
    const userId= localStorage.getItem("AdminId");
    const token=localStorage.getItem("token")


    const[message,setMessage]=useState()


    if (!token) {
      return (
        <ul>
          <a href="/user/signup">
            <li>SignUp</li>
          </a>
          <a href="/user/signIn">
            <li>SignIn</li>
          </a>
          <a href="/">
            <li>All Blogs</li>
          </a>
          <a href="/blog/addblog">
           <li>AddBlog</li>
          </a>
        </ul>
      );
    }else if (token && userId){
        return (
            <div>
                <ul>
              <a href={`/user/${userId}`}>
                <li>UserProfile</li>
              </a>
              <a href="/blog/addblog">
                <li>AddBlog</li>
              </a>
              <a href="/">
                <li>All Blogs</li>
              </a>
              <Logout/>
              {/* <a href="/user/signin">
                <li>
                    Logout
                </li>
              </a> */}
                </ul>
            </div>
          )
    }
}

export default Navbar