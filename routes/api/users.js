const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

//Get the user model
const User = require("../../models/User");

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

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }
      // Get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // Save to database
      await user.save();

      // Return jsonWebToken

      // Check the user details in console log
      // console.log(req.body);
      res.send("User Registered!");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

module.exports = router;
