import env from "dotenv";
env.config();

import "./config/dbConnect.js";
import express from "express";
import cors from "cors";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import router from "./routes/main.js";

const app = express();
const port = process.env.PORT || 7000;

const swaggerDocument = JSON.parse(
  fs.readFileSync(
    new URL("./controller/swagger/swagger.json", import.meta.url),
    "utf-8"
  )
);

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", router);

app.use("/profile", express.static("public/profile"));
app.use("/image", express.static("public/product"));
app.use("/category_Image", express.static("public/category"));

app.listen(port, () => {
  console.log("server running", port);
});