import { token } from "morgan";
import { comparePassword, hashPassword } from "../helpers/authHelp.js";
import usermodel from "../models/usermodel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js"




export const registerController =  async (req,res) => {
    try{
            const {name,email,password,phone,address,answer} = req.body;
            //validation
            if(!name){
                return res.send({message : 'name is required'});
            }
            if(!email){
                return res.send({message : 'email is required'});
            }
            if(!password){
                return res.send({message : 'password is required'});
            }
            if(!phone){
                return res.send({message : 'phone is required'});
            }
            if(!address){
                return res.send({message : 'address is required'});
            }
            if(!answer){
                return res.send({message : 'answer is required'});
            }

        //check in database for current user
        const existingUser =  await usermodel.findOne({email});

        if(existingUser){
            return res.status(200).send({
                success : false,
                message : 'Already registered with this email choose another one'
            });
        }
        //hash the password
        const hashedPassword = await hashPassword(password)

        //save the info
        const user =  await new usermodel({name,email,phone,address,password: hashedPassword,answer}).save();

        res.status(201).send({
            success : true,
            message : 'Registered successfully',
            user,
        });


    }
    catch(error){
            console.log(error);
            res.status(500).send({
                success : false,
                message : 'Registraion unsucessful',
                error,
            });
    }

};

// for login
export const loginController = async (req,res) => {
    try{
            const {email, password} = req.body;
            //validation
            if(!email || !password)
            {
                return res.status(404).send({
                    success : false,
                    message : 'invalid email or password',
                });
            }
            //check user
            const user = await usermodel.findOne({email});
            if(!user){
                return res.status(404).send({
                    success : false,
                    message : 'email not found',
                });
            }
            const match = await comparePassword(password, user.password)
            if(!match){
                return res.status(200).send({
                    success : false,
                    message : 'invalid password',
                });
            }
            //creating a token
            const token  =  await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d", });
            res.status(200).send({
                success : true,
                message : 'login sucessful',
                user:{
                    name : user.name,
                    email : user.email,
                    phone : user.phone,
                    address : user.address,
                    role : user.role,
                },
                token,
            })
    }
    catch(error){
        console.log(error);
            res.status(500).send({
                success : false,
                message : 'login unsucessful',
                error,
            });
    }
};


// forgot password
export const forgotPasswordController = async (req,res) =>{
    try {
        const [email, answer, newPassword] = req.body
        if(!email){
            res.status(400).send({message : 'email is required'})
        }
        if(!answer){
            res.status(400).send({message : 'question is required'})
        }
        if(!newPassword){
            res.status(400).send({message : 'newPassword is required'})
        }
        // check
        const user = await usermodel.findOne({email, answer})
        // validation
        if(!user){
            return res.status(404).send({
                success : false,
                message : 'wrong email or answer',
                
            })
        }
        const hashed = await hashPassword(newPassword)
        await usermodel.findByIdAndUpdate(user._id,{password :hashed })
        res.status(200).send({
            success : true,
            message : 'Password updated succesfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : 'something went wrong',
            error
        })
    }
}


export const testController = (req,res) => {
    try{

    
    res.send('route  protected');
    }catch(error){
        console.log(error)
        res.send({error})
    }
}



//update prfole
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await usermodel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await usermodel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };


//orders
//orders
export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };


  //all orders
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        // .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };


  
  //order status
  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };