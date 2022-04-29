const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const { route } = require("express/lib/application");

// Login..
router.post("/login", async (request, response) => {
  try {
    //Fetch the credentials from the database..
    const userCredentials = await User.findOne({
      id: request.body.id,
      role: request.body.role, // use as filter
    });
    !userCredentials &&
      response.status(400).json("Incorrect Credentials, Please try again..!");

    // validate the password -- on successful user found..
    const validationStatus = bcrypt.compare(
      request.body.password,
      userCredentials.password
    );
    !validationStatus &&
      response.status(400).json("Incorrect credentials, Please try again.!");

    console.log("[INFO] user login request served successfully.");
    // On successful password validation..
    // Pullout the password (Preventing the password to be leaked outside..)
    const { password, ...otherDetails } = userCredentials._doc;
    response.status(200).json(otherDetails);
  } catch (error) {
    console.log("[ERROR] Login failed. Error: " + error);
    response.status(500).json();
  }
});

router.post("/", async (request, response) => {
  response.send("In Authentication");
});

module.exports = router;
