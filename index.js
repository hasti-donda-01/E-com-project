import env from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
const app = express();
const port = process.env.PORT
app.listen(port, () => {
    console.log("server running");
})