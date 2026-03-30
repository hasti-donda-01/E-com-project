import env from 'dotenv';
env.config();
import './config/dbConnect.js'
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/main.js';
const app = express();
const port = process.env.PORT;

app.use('/api',router);

app.use("/image", express.static("public/product"));    
app.use("/category_Image", express.static("public/category"));    
app.listen(port, () => {
    console.log("server running",port);
})