import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req,res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                message : 'name is required'
            })
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory)
        {
            return res.status(201).send({
                success : true,
                message : 'category already exists'
            })
        }
        const category = await new categoryModel({name, slug:slugify(name)}).save();
        res.status(201).send({
            success : true,
            message : 'new category created',
            category,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : 'error in category',
            error

        })
    }

}


// updating the category
export const updateCategoryController = async (req,res) =>{
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug: slugify(name)},{new : true})
        res.status(200).send({
            success : true,
            message : 'category updated successfully',
            category,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : 'error in upadting',
            error
        })
        
    }
}



// get all  category
export const categoryController = async (req,res) =>{
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success : true,
            message : "all category found",
            category,
        })
        
    } catch (error) {
        res.status(500).send({
            success : false,
            message : "error while getting all category",
            error 
        })
    }
}


export const singleCategoryController = async (req,res) =>{
    try {
        
        const category = await categoryModel.findOne({ slug : req.params.slug})
        res.status(200).send({
            success : true,
            message : 'successful in single category',
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "error in single category",
            error
        })
        
    }
}


export const deleteCategoryController = async (req,res) =>{
    try {
        const {id} = req.params
        await  categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success : true,
            message : "sucessfully deletd the category",
            
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            message : "failed to delte the category",
            error,
            
        })
        
    }
}