const express = require('express');
const router= express.Router();
const Post= require('../models/Post');
const User= require('../models/User');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');


//global
const adminLayout= '../views/layouts/admin';
const jwtSecret= process.env.JWT_SECRET;


/*
    GET/
    check Login
*/

const authMiddleware=(req,res,next)=>{

   const token=req.cookies.token;

    if(!token)
    {
        return res.status(401).json({message: 'Unauthorized'});
    }
    try {
        const decoded=jwt.verify(token,jwtSecret);
        req.userId=decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'}); 
    }
}





// GET
// Adin-Login Page 

router.get('/admin',async (req,res)=>{  
    try {
        const locals={      
            title: "Admin Page",
            description: "simple Blog created with NodeJs,Express & MongoDb"
        }
        
        res.render('admin/index',{locals,layout:adminLayout});

    } catch (error) {
        console.log(error);
    }
}); 


// Post
// Adin-check Login

    
router.post('/admin', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne( { username } );
  
      if(!user) {
        return res.status(401).json( { message: 'Invalid credentials' } );
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if(!isPasswordValid) {
        return res.status(401).json( { message: 'Invalid credentials' } );
      }
  
      const token = jwt.sign({ userId: user._id}, jwtSecret );
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/dashboard');
  
    } catch (error) {
      console.log(error);
    }
  });


// Post
// Admin Dashboard

router.get('/dashboard',authMiddleware, async (req,res)=>{ 
    try {
        const locals={      
            title: "Dashboard",
            description: "simple Blog created with NodeJs,Express & MongoDb"
        }
        const data=await Post.find();
        res.render('admin/dashboard',{
            locals,
            data,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }
});


/*
Get
Admin create new Post
*/

router.get('/add-post', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: 'Add Post',
        description: 'Simple Blog created with NodeJs, Express & MongoDb.'
      }
  
      const data = await Post.find();
      res.render('admin/add-post', {
        locals,
        layout: adminLayout
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });


  /**
 * POST /
 * Admin - Create New Post
*/
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });
  
        await Post.create(newPost);
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
    // console.log(req.body);
    // res.redirect('/dashboard'); 
  
    } catch (error) {
      console.log(error);
    }
  });



  /**
 * GET /
 * Admin - Create New Post
*/
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      const locals = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
      };
  
      const data = await Post.findOne({ _id: req.params.id });
  
      res.render('admin/edit-post', {
        locals,
        data,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });

  


/**
 * PUT /
 * Admin - Create New Post
*/
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
  
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      });
  
      res.redirect(`/edit-post/${req.params.id}`);
  
    } catch (error) {
      console.log(error);
    }
  
  });

// router.post('/admin',async (req,res)=>{  
//     try {

//         const{username,password}=req.body;
//         console.log(req.body);

//         if(req.body.username==='admin' && req.body.password==='123')
//         {
//             res.send('Success');
//         }
//         else
//         {
//             res.send('Wrong input');
//         }
        
        
//         // res.render('admin/index',{locals,layout:adminLayout});

//     } catch (error) {
//         console.log(error);
//     }
// });     



// Post
// Adin-Register

router.post('/register',async (req,res)=>{  
    try {

        const{username,password}=req.body;
        const hashPassword= await bcrypt.hash(password,10);

        try {
            const user=await User.create({username,password: hashPassword});
            res.status(201).json({message: 'user created',user});   
        } catch (error) {
            if(error.code==11000)
            {
                res.status(409).json({message: 'User already in use'});
            }
            res.status(500).json({message: 'Internal Server Error'});
        }

    } catch (error) {
        console.log(error);
    }
});     


/**
 * DELETE /
 * Admin - Delete Post
*/
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
      await Post.deleteOne( { _id: req.params.id } );
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  
  });


  /**
 * GET /
 * Admin Logout
*/
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    res.redirect('/');
  });


module.exports = router;