import mongoose from "mongoose";


const connectDB = async () => {
    try{
            const conn = await mongoose.connect(process.env.MONGO_URL)
            console.log(`connected sucessfully ${conn.connection.host}`);
    }
    catch(error){
        console.log(`there is a error in connection ${error}`);
    }
}

export default connectDB;