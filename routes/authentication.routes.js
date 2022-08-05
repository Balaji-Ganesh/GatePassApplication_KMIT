const { response } = require("express");
const express = require("express");
const router = express.Router();
require("dotenv").config();

// for getting a existing user...(for authentication purpose) based on
router.post("", async (request, response) => {
  /* --- Look at this later in the coming version...
    console.log(request.body);
  try {
    //Fetch the credentials from the database..
    const userCredentials = await Details.findOne({
      Name: request.body.Name,
    });
    console.log("[INFO] Received credentials from db: " + userCredentials);
    !userCredentials &&
      response.status(400).json("Incorrect Credentials, Please try again..!");

    // validate the password -- on successful user found..
    const validationStatus = await bcrypt.compare(
      request.body.password,
      userCredentials.Password
      // (error, result) => {
      //   if (error) console.log("ERROR: Passwords do not match");
      //   else if (result) console.log("Result: " + result);
      // }
    );
    !validationStatus &&
      response.status(400).json("Incorrect credentials, Please try again.!");

    console.log("[INFO] validation status: " + validationStatus);
    console.log("[INFO] user login request served successfully.");
    // On successful password validation..
    // Pullout the password (Preventing the password to be leaked outside..)
    const { password, ...otherDetails } = userCredentials._doc;
    response.status(200).json(otherDetails);
  } catch (error) {
    console.log("[ERROR] Login failed. Error: " + error);
    response.status(500).json();
  } */
  console.log(request.body);
  if (
    request.body.Name == process.env.UNAME &&
    request.body.password == process.env.PASSWORD
  )
    response.status(200).json({ msg: "Login Success" });
  else response.status(500).json({ msg: "Invalid Credentials" });
});

module.exports = router;
