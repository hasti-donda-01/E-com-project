import env from 'dotenv';
env.config();
import dns from 'dns'
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DB Connected");
}).catch((error) => {
    console.log(error)
})