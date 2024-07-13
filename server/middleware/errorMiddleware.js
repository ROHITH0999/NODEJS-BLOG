// const { Error } = require("mongoose")

//404 error
const notFound=(req,res,next)=>{
    const error=new Error(`not found - ${req.originUrl}`)
    res.status(404);
    next(error);
}

//middleware  to handlers
const errorHandler=(error,req,res,next)=>{
    if(res.headerSent)
    {
        return next(error);
    }

    res.status(error.code || 500).json({message:error.message || "Unknown error occured"})
}

module.exports={notFound,errorHandler};