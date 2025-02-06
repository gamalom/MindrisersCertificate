const express = require("express");
const { connectDatabase } = require("./database/database");
const app = express();

//ROUTES HERE
const authRoute = require("./routes/auth/authRoute");
const productRoute = require("./routes/admin/productRoute");
const adminUsersRoute = require("./routes/admin/adminUsersRoutes");
const userReviewRoute = require("./routes/user/userReviewRoute");
const profileRoute = require("./routes/user/profileRoutes");
const cartRoute = require("./routes/user/cartRoutes");
const orderRoute = require("./routes/user/orderRoutes");
const adminOrderRoute = require("./routes/admin/adminOrderRoutes");
const paymentRoute = require("./routes/user/paymentRoute");

//ROUTES END

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

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/admin", adminUsersRoute);
app.use("/api/admin", adminOrderRoute);
app.use("/api/reviews", userReviewRoute);
app.use("/api/profile", profileRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payment", paymentRoute);

//server is running
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server is running at PORT " + PORT);
});
