const {
  initiateKhaltiPayment,
  verifyPidx,
} = require("../../controller/user/payment/paymentController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");

const router = require("express").Router();

router.route("/").get(isAuthenticated, catchAsync(initiateKhaltiPayment));

router.route("/success").get(isAuthenticated, catchAsync(verifyPidx));
module.exports = router;
