import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom';

import { FaCheck, FaEdit } from "react-icons/fa";
import {useContext } from 'react';
import {UserContext} from '../context/userContext'
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';


const UserProfile = () => {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currpassword, setCurrpassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [isAvatarTouched,setIsAvatarTouched] =useState(false);
  const [error,setError]=useState('');

  const navigate=useNavigate(); 

  //usercontext is an object contain id,token,name
  const {currentUser}=useContext(UserContext);
  const token=currentUser?.token;

  //redirect to login page for any user who is not logged in
  useEffect(()=>{
    if(!token){
      navigate('/login');
    }
  },[])

  const changeAvatarHandler=async()=>{
      try {
        setIsAvatarTouched(false);
        const postData=new FormData();
        postData.set('avatar',avatar)
        const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`,postData,{
          withCredentials:true,
          headers:{Authorization:`Bearer ${token}`}
        })

        setAvatar(response?.data.avatar)
      } catch (error) {
        setError(error);

      }
  }

  const {id}=useParams();

  useEffect(()=>{
    const getUser=async()=>{
      const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`,{
         withCredentials:true,
          headers:{Authorization:`Bearer ${token}`}
      })
      const {name,email,avatar}=response.data;
      setName(name);
      setEmail(email);
      setAvatar(avatar);
    }

    getUser();
  },[])

  const updateUserDetail = async (e) => {
    e.preventDefault();
  
    try {
      const userData = new FormData();
      userData.append('name', name);
      userData.append('email', email);
      userData.append('currPassword', currpassword);
      userData.append('newPassword', newpassword);
      userData.append('confirmPassword', confirmpassword);
  
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response && response.status === 200) {
        // Successful update logic here
        navigate('/logout');
      } else {
        throw new Error('Failed to update user details');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      setError(error.response?.data?.message || 'Failed to update user details. Please try again.');
    }
  };
  


  return (
    <section className='profile'>
        <div className="container profile__container">
          <Link to={`/myposts/${currentUser.id}`} className='btn'>My posts</Link>

          <div className="profile__details">
              <div className="avatar__wrapper">
                <div className="profile__avatar">
                  <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="" />
                </div>
                <form className='avatar__form'>
                  <input type="file" name="avatar" id="avatar" onChange={e=>{setAvatar(e.target.files[0])}} accept='png,jpg,jpeg' />
                  <label htmlFor="avatar" onClick={()=>{setIsAvatarTouched(true)}}><FaEdit/></label>
                </form>
                {isAvatarTouched && <button className='profile__avatar-btn' onClick={changeAvatarHandler}><FaCheck/></button>}
              </div>
              <h1>{currentUser.name}</h1>

              <form  className="form profile__form" onSubmit={updateUserDetail}>
                {error && <p className="form__error-message">{error}</p>}
                <input type="text" placeholder='Full Name' value={name} onChange={e=>setName(e.target.value)} />
                <input type="email" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder='Current Password' value={currpassword} onChange={e=>setCurrpassword(e.target.value)} />
                <input type="password" placeholder='New Password' value={newpassword} onChange={e=>setNewpassword(e.target.value)} />
                <input type="password" placeholder='Confirm Password' value={confirmpassword} onChange={e=>setConfirmpassword(e.target.value)} />
                <button type="submit" className='btn primary'>Update details</button>
              </form>
          </div>
        </div>
    </section>
  )
}

export default UserProfile;


