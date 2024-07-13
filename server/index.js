require('dotenv').config()
const express = require('express');
const {connect} = require('mongoose');
const userRoutes =require('./routes/userRoutes')
const postRoutes =require('./routes/postRoutes')
const cors=require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const fileUpload = require('express-fileupload');

const PORT=process.env.PORT || 5000;

const app=express();

app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials:true, origin:"http://localhost:3000"}));

app.use(fileUpload());
app.use('/uploads',express.static(__dirname + '/uploads'))

app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI).then(()=>{
    console.log("database connected...");
}).catch((e)=>{
    console.log("Not connected database");
})

app.listen(process.env.PORT,()=>{
    console.log(`Listning in port ${PORT} `)
})
