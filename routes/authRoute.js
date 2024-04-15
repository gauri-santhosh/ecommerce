import express from "express";
import {registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from '../controllers/authController.js';
import { requireSignIn, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();
// routing for registrarion
router.post('/register',registerController);


//routing for login
router.post('/login',loginController);


// forgot password
router.post('/forgot-password', forgotPasswordController);

// test routes
router.get('/test', requireSignIn, isAdmin, testController)

//proteced routing for dashboard
router.get('/user-auth', requireSignIn, (req,res) => {
    res.status(200).send({ ok : true })
})


// this route is for admin
router.get('/admin-auth', requireSignIn, isAdmin, (req,res) => {
    res.status(200).send({ ok : true })
})


//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);


//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);


// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router