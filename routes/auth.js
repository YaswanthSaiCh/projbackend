const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { signOut, signIn, signUp, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name should be minimum 3 characters"),
  body("email").isEmail().withMessage("Enter a valid e-mail address"),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Make your password stronger!!!"),
  signUp
);

router.post(
  "/signin",
  body("email").isEmail().withMessage("e-mail is requrired"),
  body("password").isLength({ min: 1 }).withMessage("Password is required"),
  signIn
);

router.get("/signout", signOut);

router.get("/testroute", isSignedIn, (req, res) => {
  res.json({
    auth: req.auth,
    message: "Test route",
  });
});

module.exports = router;
