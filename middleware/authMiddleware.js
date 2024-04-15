import JWT from "jsonwebtoken";
import usermodel from "../models/usermodel.js";

// protecting the routes
export const requireSignIn = async (req,res,next) => {
       try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();



       } catch (error) {
        console.log(error)
       }
};

//for admin acess
export const isAdmin = async (req,res,next) => {
    try {
        const user = await usermodel.findById(req.user._id)
        if(user.role !== 1){
            return res.status(401).send({
                success : false,
                message : 'Unauthorized access',
            })
        }else{
            next();
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success : false,
            message : 'error in admin miidleware',
            error
        })
    }

}