const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .then((order) => {
      req.order = order;
      next();
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({ error: "No order found" });
      }
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order
    .save()
    .then((createdOrder) => {
      res.json({ createdOrder });
    })
    .catch((err) => {
      if (err) return res.status(400).json({ error: "Error creating order" });
    });
};

exports.getAllOrders = (req, res) => {
  Order.find({})
    .populate("user", "_id name")
    .then((allOrders) => {
      res.json(allOrders);
    })
    .catch((err) => {
      if (err) return res.status(400).json({ error: "No orders found" });
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
  Order.findOneAndUpdate(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } }
  )
    .then((updatedOrder) => {
      res.json(updatedOrder);
    })
    .catch((err) => {
      if (err)
        return res.status(400).json({ error: "Unable to update status" });
    });
};
