import React from "react";
import Signup from './components/Signup';
import Signin from "./components/Signin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./components/UserInfo"; // Assume this is your user profile component
import AddBlog from "./components/AddBlog";
import BlogInfo from "./components/BlogInfo"
import AllBlogs from "./components/AllBlogs"
import Navbar from "./components/Navbar";
// import Logout from "./components/Logout";
import UpdateBlog from "./components/UpdateBlog";

function App() {
  // window.location.reload()
  return (
    <div>
      <Navbar />
      <Router>
        <Routes>
          {/* Define the route for user info */}
          <Route path="/user/signIn" element={<Signin />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/user/signup" element={<Signup/>}/>
          <Route path="/blog/addblog" element={<AddBlog/>}/>
          <Route path="/blog/:id" element={<BlogInfo />} />
          <Route path="/" element={<AllBlogs/>}/>
          <Route path="/update/:id" element={<UpdateBlog/>}/>
          {/* <Route path="/user/logout" element={<Logout/>}/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
