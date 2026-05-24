/** @format */

// app.js
const express = require("express");
const db = require("./src/config/db");
const configureMiddleware = require("./src/config/middleware");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/output/swagger-output.json");

const app = express();

configureMiddleware(app);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);


app.get("/", (req, res) => {
  /* #swagger.ignore = true */
  // This route is protected and can only be accessed by authenticated users
  res.json({ message: "working" });
});



app.get("/swagger-test", (req, res) => {
  res.json(swaggerDocument);
});

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, async () => {
//   console.log(`Server is running on port ${PORT}`);
//   await db.connectToDatabase();
// });


app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

db.connectToDatabase();





module.exports = app;
