const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { expressjwt: expressJwt } = require("express-jwt");

exports.signUp = (req, res) => {
  const errorList = validationResult(req);
  const user = new User(req.body);
  if (!errorList.isEmpty()) {
    return res.status(422).json({ error: errorList.array()[0].msg });
  }
  user
    .save()
    .then((user) =>
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
      })
    )
    .catch((err) =>
      res.status(400).json({
        error: "Unable to save user in DB.",
      })
    );
};

exports.signIn = (req, res) => {
  const errorList = validationResult(req);
  const { email, password } = req.body;
  if (!errorList.isEmpty()) {
    return res.status(422).json({
      error: errorList,
    });
  }
  User.findOne({ email })
    .then((user) => {
      //authentication and setting token
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: "Sorry, the password you entered is incorrect.",
        });
      }
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
      res.cookie("authToken", token, { expiresIn: "1h" });

      //send response to front-end
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, name, email, role } });
    })
    .catch((error) => {
      if (error) {
        return res.status(400).json({
          error: "User not found.",
        });
      }
    });
};
exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET_KEY,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  const isAuth = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!isAuth) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an authorized Admin",
    });
  }
  next();
};
