const { default: axios } = require("axios");
const Order = require("../../../model/orderSchema");

exports.initiateKhaltiPayment = async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({
      message: "Please provide orderId,amount",
    });
  }
  const data = {
    return_url: "http://localhost:3000/api/payment/success",
    purchase_order_id: orderId,
    amount: amount * 100,
    website_url: "http://localhost:3000/",
    purchase_order_name: "orderName_" + orderId,
  };

  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    data,
    {
      headers: {
        Authorization: "key 5e8267bf9cf344448a9068b95b75c23c",
      },
    }
  );
  console.log(response.data);
  let order = await Order.findById(orderId);
  order.paymentDetails.pidx = response.data.pidx;
  await order.save();

  res.redirect(response.data.payment_url);
};

exports.verifyPidx = async (req, res) => {
  const userId = req.user.id;
  const pidx = req.query.pidx;

  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    { pidx },
    {
      headers: {
        Authorization: "key 5e8267bf9cf344448a9068b95b75c23c",
      },
    }
  );
  if (response.data.status == "Completed") {
    let order = await Order.find({ "paymentDetails.pidx": pidx });

    order[0].paymentDetails.method = "khalti";
    order[0].paymentDetails.status = "paid";
    await order[0].save();
    res.redirect("http://localhost:3000");
  } else {
    res.redirect("http://localhost:3000/errorPage");
  }
  res.send(response.data);
};
