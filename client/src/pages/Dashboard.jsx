import React from 'react'
import {Link} from 'react-router-dom'
import { useState,useContext } from 'react';
import {UserContext} from '../context/userContext'
import { useEffect } from 'react';
import {useNavigate,useParams} from 'react-router-dom'
import axios from 'axios'
import Loaders from '../Components/Loaders'
import DeletePost from './DeletePost';

const Dashboard = () => {
  const [posts,setPosts]=useState([]);
  const navigate=useNavigate(); 
  const {id}=useParams();

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


  useEffect(()=>{
      
    const fetchData=async()=>{
        setIsLoading(true);
        try {
            const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,{
              withCredentials:true,
              headers:{Authorization:`Bearer ${token}`}
            })
            setPosts(response.data);
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false);
    }

    fetchData();

  },[id])

  if(isLoading){
    return <Loaders/>
  }

  return (
    <section className="dashboard">
      {
        posts.length ? <div className="container dashboard__container">
          {
            posts.map((post=>{
              return <article className="dashboard__post" key={post.id}>
                <div className="dashboard__post-info">
                    <div className="dashboard__post-thumbnail">
                      <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
                    </div>
                    <h5>{post.title}</h5>
                </div>
                <div className="dashboard__post-actions">
                   <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
                   <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                   <DeletePost postID={post._id}/>
                </div>
              </article>
            }))
          }

        </div>:<h2 className='center'>You have no post yet.</h2>
    }
    </section>
  )
}

export default Dashboard;
