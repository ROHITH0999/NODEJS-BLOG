import React, { useEffect, useState } from 'react'
import PostItem from './PostItem'
import Loaders from './Loaders';
import axios from 'axios';


// import {DUMMY_POSTS} from '../data';


const Posts = () => {

    const [post,setPosts]=useState([]);
    const [isLoading,setIsLoading]=useState(false);

    useEffect(()=>{
        const fetchPost= async ()=>{
            setIsLoading(true);
            try {
                const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`)
                setPosts(response?.data);
            } catch (error) {
                console.log(error)
            }

            setIsLoading(false); 
        }
        fetchPost();
    },[])

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

export default Posts
