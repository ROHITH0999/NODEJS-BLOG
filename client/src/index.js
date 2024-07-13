import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout';
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Authors from './pages/Authors.jsx';
import CreatePost from './pages/CreatePost';
import CategoryPosts from './pages/CategoryPosts';
import AuthorPosts from './pages/AuthorPosts.jsx';
import Dashboard from './pages/Dashboard';
import EditPost from './pages/EditPost';
import DeletePost from './pages/DeletePost.jsx';
import LogOut from './pages/LogOut';
import UserProvider from './context/userContext';
import Loaders from './Components/Loaders.jsx';


const router=createBrowserRouter([
  {
    path:"/",
    element:<UserProvider><Layout/></UserProvider>,
    errorElement:<ErrorPage/>,
    children:[
      { index: true,element:<Home/> },
      { path:"posts/:id",element:<PostDetails/>},
      { path:"register" ,element:<Register/>},
      { path:"login" ,element:<Login/>},
      { path:"profile/:id" ,element:<UserProfile/>},
      { path:"authors" ,element:<Authors/>},
      { path:"create" ,element:<CreatePost/>},
      { path:"posts/categories/:category" ,element:<CategoryPosts/>},
      { path:"posts/users/:id" ,element:<AuthorPosts/>},
      { path:"myposts/:id" ,element:<Dashboard/>},
      { path:"posts/:id/edit" ,element:<EditPost/>},
      { path:"posts/:id/delete" ,element:<DeletePost/>},
      { path:"logout" ,element:<LogOut/>},
      
      
    ]
  }
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>
);
