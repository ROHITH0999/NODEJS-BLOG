const User=require('../models/userModel')
const HttpError=require('../models/errorModel')
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken')
const fs = require('fs');
const path = require('path');
const {v4:uuid} =require('uuid');

// =========REGISTER NEW USER
// POST:api/users/register
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;

        if (!name || !email || !password) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();
        const isEmail = await User.findOne({ email: newEmail });

        if (isEmail) {
            return next(new HttpError("Email already exists.", 422));
        }

        // Corrected password length check
        if (password.trim().length < 6) {
            return next(new HttpError("Password should be at least 6 characters", 422));
        }

        // Corrected typo in error message
        if (password !== password2) {
            return next(new HttpError("Passwords don't match", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        // Corrected email key
        const newUser = await User.create({ name, email: newEmail, password: hashPass });

        res.status(201).json(`new user ${newUser.email} has registered`);
    } catch (error) {
        // Fixed error handling in catch block
        return next(new HttpError("User registration failed.", 500));
    }
};







// POST:api/users/login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new HttpError("Please fill all fields", 422));
        }

        const isEmail = email.toLowerCase();
        const user = await User.findOne({ email: isEmail });

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (isPasswordCorrect) {
                const {_id:id,name}=user;
                const token=jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"})


                return res.status(200).json({token,id,name});
            } else {
                return next(new HttpError("Wrong password. Try again", 401));
            }
        } else {
            return next(new HttpError("Invalid Email Id. Try again", 404));
        }
    } catch (error) {
        return next(new HttpError("Login failed. Please try again.", 500));
    }
};






// POST:api/users/:id
const getUser=async(req,res,next)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id).select('-password');

        if(!user)
        {
            return next(new HttpError("User not found"));
        }

        res.status(200).json(user);
    }
    catch (error) {
        return next(new HttpError(error));
   
    }
}









// change user avatar
// POST:api/users/change-avatar
const changeAvatar = async (req, res, next) => {
    try {
        if(!req.files.avatar) {
            return next(new HttpError('Please choose an image.', 422));
        }

        // Find user from database
        const user = await User.findById(req.user.id);
        if(!user) {
            return next(new HttpError('User not found.', 404));
        }

        // Delete old avatar if exists
        if(user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    return next(new HttpError('Error deleting old avatar: ' + err.message, 500));
                }
            });
        }

        const { avatar } = req.files;
        
        // Check size
        if(avatar.size > 500000) {
            return next(new HttpError("Uploaded picture size is greater than 500KB.", 422));
        }

        const filename = avatar.name;
        const splitName = filename.split('.');
        const newFilename = splitName[0] + uuid() + '.' + splitName[splitName.length - 1];

        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if(err) {
                return next(new HttpError('Error moving file: ' + err.message, 500));
            }

            const updatedUser = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true });

            if(!updatedUser) {
                return next(new HttpError("Avatar couldn't be changed.", 500));
            }

            res.status(201).json(updatedUser);
        });

    } catch (error) {
        return next(new HttpError('Error: ' + error.message, 500));
    }
};










// edit user  details
// POST:api/users/edit-user
const editUser = async (req, res, next) => {
    try {
        const { name, email, currPassword, newPassword, newconfirmPassword } = req.body;

        if (!name || !email || !currPassword || !newPassword) {
            return next(new HttpError("Fill all the fields.", 422));
        }
        
        // Get user from database
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError("User not found", 403));
        }
        
        // Check if new email already exists for another user
        const emailExist = await User.findOne({ email });
        if (emailExist && (emailExist._id !== req.user.id)) {
            return next(new HttpError("Email already exists", 422));
        }
        
        // Compare current password with database password
        const validPass = await bcrypt.compare(currPassword, user.password);
        if (!validPass) {
            return next(new HttpError("Invalid current password", 422));
        }
        
        // Compare new password with new confirm password
        if (newPassword !== newconfirmPassword) {
            return next(new HttpError("New passwords do not match", 422));
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        // Update user info in the database
        const newInfo = await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            password: hash // Update password field with hashed password
        }, { new: true });

        res.status(200).json(newInfo);
        
    } catch (error) {
        return next(new HttpError('Error editing user ' + error));
    }
};









// get user  authors
// POST:api/users/authors

const getAuthors=async(req,res,next)=>{
    try {
        const authors=await User.find().select('-password');
        res.json(authors); 
    } catch (error) {
        return next(new HttpError(error));
    }
}

module.exports={registerUser,getAuthors,editUser,changeAvatar,getUser,loginUser};
