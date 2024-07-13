import React from 'react'
import axios from 'axios';
import Loaders from '../Components/Loaders';
import PostItem from '../Components/PostItem';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CategoryPost = () => {
  const [post,setPosts]=useState([]);
  const [isLoading,setIsLoading]=useState(false);

  const {category}=useParams(); 

  useEffect(()=>{
      const fetchPost= async ()=>{
          setIsLoading(true);
          try {
              const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`)
              setPosts(response?.data);
          } catch (error) {
              console.log(error)
          }

          setIsLoading(false); 
      }
      fetchPost();
  },[category])

  if(isLoading){
      return <Loaders/>
  }

return (
      <section className='posts'>
          {post.length > 0 ? <div className="container posts__container">
                  {
                      post.map(({_id:id,thumbnail,category,title,description,creator,createdAt})=> 
                      <PostItem key={id}
                              postID={id}
                              thumbnail={thumbnail}
                              category={category}
                              title={title}
                              description={description}
                              authorID={creator}
                              createdAt={createdAt}
                      />)
                  }

          </div>: <h2 className='center'>No posts found</h2>}
      </section>
)
}

export default CategoryPost
