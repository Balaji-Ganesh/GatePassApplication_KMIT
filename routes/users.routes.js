const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const { route } = require("express/lib/application");
const Post = require("../models/Permission.model");

// GET..
router.get("/:id", async (request, response) => {
  try {
    console.log("[INFO] userId: " + request.params.id);
    // Get the user details by userId..(from params)
    const userCredentials = await User.findById(request.params.id);
    // Pullout the password (while sending) -- security concern..
    const { password, ...otherDetails } = userCredentials._doc;
    console.error("[INFO] User details found");
    response.status(200).json(otherDetails);
  } catch (error) {
    console.error(
      '[ERROR] Invalid "userId" received. Please try logging in once more. \nError: ' +
        error
    );
  }
});
module.exports = router;
