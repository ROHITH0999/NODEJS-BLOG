import React, { useState,useContext ,useEffect} from 'react'
import {Link} from 'react-router-dom'
import logo from '../images/logo.jpg'
import { FaBars } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";

import { UserContext } from '../context/userContext';


const Header = () => {
  const [isNavshowing,setIsNavshowing]=useState(window.innerWidth > 800 ? true :false);
  const {currentUser}=useContext(UserContext);


  const closeNavHandler=()=>{
    if(window.innerWidth < 800)
      {
        setIsNavshowing(false);
      }
      else
      {
        setIsNavshowing(true);
      }
  }

  // useEffect(() => {
  //   // This will re-render the component when currentUser changes
  // }, [currentuser]);

  return (
    <div>
        <nav>
          <div className="container nav__container">
            <Link to="/" className='nav__logo' onClick={closeNavHandler}>
              <img src={logo} alt="Navbar logo" />
            </Link>
            {/* <h1 style={{ textShadow: "2px 2px 5px rgba(0,0,0,0.5)" }}>MERN BLOG WEBSITE</h1> */}
            
            {currentUser?.id && isNavshowing && <ul className="nav__menu">
              <li><Link to={`/profile/${currentUser.id}`} onClick={closeNavHandler}>Welcome  {currentUser?.name}</Link></li>
              <li><Link to="/create" onClick={closeNavHandler}>Create Post</Link></li>
              <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
              <li><Link to="/logout" onClick={closeNavHandler}>Log Out</Link></li>
            </ul>}
            {!currentUser?.id && isNavshowing && <ul className="nav__menu">
              <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
              <li><Link to="/login" onClick={closeNavHandler}>Log In</Link></li>
            </ul>}


            <button className='nav__toggle-btn' onClick={()=>setIsNavshowing(!isNavshowing)}>
             {isNavshowing? <AiOutlineClose/> :<FaBars/>}
            </button>
          </div>
        </nav>
    </div>
  )
}

export default Header;
