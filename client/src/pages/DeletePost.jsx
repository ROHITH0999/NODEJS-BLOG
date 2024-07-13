import React from 'react'
import { useState,useContext } from 'react';
import {UserContext} from '../context/userContext'
import { useEffect } from 'react';
import {Link, useNavigate,useLocation} from 'react-router-dom'
import axios from 'axios'
import Loaders from '../Components/Loaders';


const DeletePost = ({postID:id}) => {
  const navigate=useNavigate(); 
  const location=useLocation();
  const [isLoading,setIsLoading]=useState(false);
  //usercontext is an object contain id,token,name
  const {currentUser}=useContext(UserContext);
  const token=currentUser?.token;


  //redirect to login page for any user who is not logged in
  useEffect(()=>{
    if(!token){
      navigate('/login');
    }
  },[])

  const removePost=async()=>{
    setIsLoading(true);
    try{
      const response=await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`,{
        withCredentials:true,
        headers:{Authorization: `Bearer ${token}`}
      })

      if(response.status==200){
        if(location.pathname==`/myposts/${currentUser.id}`){
          navigate(0);
        }else{
          navigate('/');
        }
      }
      setIsLoading(false)
    }
    catch(error){
      console.log(error);
    }
  }

  if(isLoading){
    return <Loaders/>
  }

  return (
    <Link className='btn sm danger' onClick={()=>{removePost(id)}}>Delete</Link>
  )
}

export default DeletePost;
