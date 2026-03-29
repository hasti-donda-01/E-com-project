import env from 'dotenv';
env.config();
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DB Connected");
}).catch((error) => {
    console.log(error)
})