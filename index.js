import env from 'dotenv';
env.config();
import './config/dbConnect.js'
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/main.js';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './controller/Swagger/swagger.json' with { type: 'json' };

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = process.env.PORT;
app.use(express.json())
app.use('/api', router);

app.use("/image", express.static("public/product"));
app.use("/category_Image", express.static("public/category"));
app.listen(port, () => {
    console.log("server running", port);
})




// http://localhost:7000/api-docs