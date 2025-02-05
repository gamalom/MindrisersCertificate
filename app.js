const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();

//ROUTES HERE
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const adminUsersRoute = require("./routes/adminUsersRoutes");
const userReviewRoute = require("./routes/userReviewRoute");

//ROUTES END
const {
  registerUser,
  login,
  loginUser,
} = require("./controller/auth/authController");
//tell node to use dotenv
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//TELLING NODE TO GIVE ACESS TO THE UPLOAD FILE
app.use(express.static("./uploads"));
//connect database
connectDatabase(process.env.MONGO_URL);

//test api to check if serer is live or not
app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello world",
  });
});

app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", adminUsersRoute);
app.use("/api", userReviewRoute);

//server is running
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server is running at PORT " + PORT);
});
