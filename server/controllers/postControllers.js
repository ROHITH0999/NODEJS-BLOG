const Post = require('../models/postModel')
const fs = require('fs');
const path = require('path');
const {v4:uuid} =require('uuid');
const User=require('../models/userModel')
const HttpError=require('../models/errorModel');
const { error } = require('console');

// ============CREATE POST+============
//POST :api/post
const createPost = async (req, res, next) => {
    try {
        const { title, category, description } = req.body;

        // Validate required fields
        if (!title || !category || !description) {
            return next(new HttpError("Fill all the fields", 422));
        }

        // Validate file upload
        if (!req.files || !req.files.thumbnail) {
            return next(new HttpError("Please upload a thumbnail", 422));
        }

        const thumbnail = req.files.thumbnail;

        // Check file size
        if (thumbnail.size > 2000000) { // 200000 bytes = 200 KB
            return next(new HttpError("Size greater than 200KB", 422));
        }

        // Generate new filename
        const filename = thumbnail.name;
        const splitName = filename.split('.');
        const newFilename = splitName[0] + uuid() + '.' + splitName[splitName.length - 1];

        // Move the file
        thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError('Error moving the file: ' + err.message, 500));
            }

            try {
                // Create a new post
                const newPost = await Post.create({
                    title,
                    category,
                    description,
                    thumbnail: newFilename,
                    creator: req.user.id
                });

                if (!newPost) {
                    return next(new HttpError('Post could not be created', 422));
                }

                // Update user's post count
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

                res.status(201).json(newPost);
            } catch (err) {
                return next(new HttpError('Error creating post: ' + err.message, 500));
            }
        });
    } catch (error) {
        return next(new HttpError('Server error: ' + error.message, 500));
    }
};






// ============GET POST+============
//POST :api/post
const getPosts=async (req,res,next)=>{
    try {
        const posts=await Post.find().sort({updatedAt:-1})
        res.status(201).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}



// ============GET SINGLE POST+============
//POST :api/post
const getPost=async (req,res,next)=>{
    try {
        const postId=req.params.id;
        const post=await Post.findById(postId);

        if(!post){
            return next(new HttpError("Post not found"),404);
        }

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error))
    }
}


// ============GET POST BY CATEGORY============
//POST :api/post
const getCatPosts=async (req,res,next)=>{
    try {
        const {category}=req.params;
        const catPosts=await Post.find({category}).sort({createdAt:-1})
        res.status(200).json(catPosts);
    } catch (error) {
        return next(new HttpError(error))
        
    }
}






// ============GET POST BY AUTHOR============
//POST :api/post
const getUserPosts=async (req,res,next)=>{
    try {
        const {id}=req.params;
        const posts=await Post.find({creator:id}).sort({createdAt:-1})
        res.status(200).json(posts);
        
    } catch (error) {
        return next(new HttpError(error))
        
    }
}


// ============EDIT POST===========
//POST :api/post
const editPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, category, description } = req.body;

        // Validate required fields
        if (!title || !category || description.length < 12) {
            return next(new HttpError("Fill all the fields and ensure description is at least 12 characters long", 422));
        }

        let updatedPost;

        if (!req.files || !req.files.thumbnail) {
            // Update post without changing the thumbnail
            updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description }, { new: true });
            if (!updatedPost) {
                return next(new HttpError("Couldn't update post", 400));
            }
            return res.status(200).json(updatedPost);
        } else {
            // Get the old post from the database
            const oldPost = await Post.findById(postId);
            if (!oldPost) {
                return next(new HttpError("Post not found", 404));
            }

            // Delete old thumbnail
            if(req.user.id==oldPost.creator){
                
                fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                    if (err) {
                        return next(new HttpError('Error deleting old thumbnail: ' + err.message, 500));
                    }
    
                    // Upload new thumbnail
                    const { thumbnail } = req.files;
    
                    // Check file size
                    if (thumbnail.size > 2000000) {
                        return next(new HttpError("Size is greater than 2MB", 422));
                    }
    
                    // Generate new filename
                    const filename = thumbnail.name;
                    const splitName = filename.split('.');
                    const newFilename = splitName[0] + uuid() + '.' + splitName[splitName.length - 1];
    
                    // Move the new file
                    thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
                        if (err) {
                            return next(new HttpError('Error moving file: ' + err.message, 500));
                        }
    
                        // Update post with new thumbnail
                        updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, thumbnail: newFilename }, { new: true });
                        if (!updatedPost) {
                            return next(new HttpError("Couldn't update post", 400));
                        }
    
                        // Send response after successful update
                        return res.status(200).json(updatedPost);
                    });
                });
            }
        }
    } catch (error) {
        return next(new HttpError('Server error: ' + error.message, 500));
    }
};





// ============DELETE POST===========
//POST :api/post
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return next(new HttpError('Post unavailable', 400));
        }

        const post = await Post.findById(postId);

        if (!post) {
            return next(new HttpError('Post not found', 404));
        }

        const fileName = post.thumbnail;

        if (req.user.id === post.creator.toString()) {
            // Delete thumbnail from folder
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if (err) {
                    return next(new HttpError('Error deleting thumbnail: ' + err.message, 500));
                }

                // Delete the post from the database
                await Post.findByIdAndDelete(postId);

                // Find user and reduce post count
                const currUser = await User.findById(req.user.id);

                if (!currUser) {
                    return next(new HttpError('User not found', 404));
                }

                const userPostCount = currUser.posts - 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

                res.status(200).json({ message: `Post ${postId} deleted successfully` });
            });
        } else {
            return next(new HttpError('Unauthorized to delete this post', 403));
        }
    } catch (error) {
        return next(new HttpError('Server error: ' + error.message, 500));
    }
};

module.exports={deletePost,editPost,getUserPosts,getCatPosts,getPost,getPosts,createPost}