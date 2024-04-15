import  express  from "express";
// import { isAdmin, requireSignIn } from "../middleware/authMiddleware";
import { categoryController,  createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";
import { requireSignIn, isAdmin} from "../middleware/authMiddleware.js";
import categoryModel from "../models/categoryModel.js";


const router = express.Router()


// routes
// creating  the category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

// updating the category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)


// get all category
router.get('/get-category', categoryController)



// single category
router.get('/single-category/:slug', singleCategoryController)

// delete category
router.delete('/delete-category/:id',requireSignIn, isAdmin, deleteCategoryController)

export default router