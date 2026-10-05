import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "E-Com API",
    description: "E-commerce backend API",
    version: "1.0.0",
  },
  host: "e-com-project-b3ci.onrender.com",
  basePath: "/",
  schemes: ["https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Enter: Bearer <your token>",
    },
  },
};

const outputFile = "./controller/swagger/swagger.json";

// List main.js plus every router file it imports, so all endpoints are found
const routeFiles = ["./routes/main.js"];

swaggerAutogen({ openapi: "2.0" })(outputFile, routeFiles, doc);