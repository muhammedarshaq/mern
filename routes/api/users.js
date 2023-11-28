const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// @route   POST  api/users
// @desc    Register user
// @access  public
router.post(
  "/",
  [
    check("name", "Name is required!").not().isEmpty(),
    check("email", "Please enter valid email!").isEmail(),
    check("password", "Password should contain 6 or more characters!").isLength(
      { min: 6 }
    ),
  ],

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    res.send("User route");
  }
);

module.exports = router;
