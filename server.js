import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
// import categoryRoute from "./routes/categoryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors';
// config env
dotenv.config();

//database connect
connectDB();


// rest object
const app = express();

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


//routes
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/category",categoryRoute)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)

//rest api
app.get("/",(req,res) =>{
    res.send("<h1>hello trying mern for the first time</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>{
    console.log(`the server is running in ${PORT}`);
});
