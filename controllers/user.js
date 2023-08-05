const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      req.profile = user;
      next();
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({ error: "User not found" });
      }
    });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encryptedPassword = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false }
  )
    .then((updatedUser) => {
      updatedUser.salt = undefined;
      updatedUser.encryptedPassword = undefined;
      updatedUser.createdAt = undefined;
      updatedUser.updatedAt = undefined;
      return res.json(updatedUser);
    })
    .catch((err) => {
      if (err) return res.status(400).json({ error: "Unable to update user" });
    });
};

exports.userPurchaseList = (req, res) => {
  const orders = Order.find({ user: req.profile._id }).populate(
    "user",
    "_id name"
  );
  if (!orders) return res.status(400).json({ error: "No orders found" });
  return res.status(200).json(orders);
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      stock: product.stock,
      amount: req.body.order.amount,
      transactionId: req.body.order.transactionId,
    });
  });

  //Stroing purchases in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true }
  )
    .then((purchaseList) => {
      next();
    })
    .catch((err) => {
      if (err)
        return res.status(400).json({ error: "Unable to save purchase list" });
    });
};
// Get all Users Controller
// exports.getAllUsers = (req, res) => {
//   User.find({})
//     .then((allUsers) => {
//       return res.status(200).json({ allUsers });
//     })
//     .catch((err) => {
//       if (err) {
//         return res.status(400).json({ error: "No records found" });
//       }
//     });
// };
