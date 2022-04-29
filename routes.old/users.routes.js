const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

// GET.. single user
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

// Creating a new user..
// Registration.. <- will happen through postman for creation of new users.
router.post("/", async (request, response) => {
  try {
    /*---------------------------------- Registering a new user--------------------------------- */
    // Generate the hashed password -- Security concern..
    const saltRounds = 10; // Tune it according, as per requirement.
    console.log(request.body);
    const defaultPwd = "GatePassApplication";
    const hashedPwd = await bcrypt.hash(defaultPwd, saltRounds);
    // Go for creation of the new user..
    const newUser = new User({
      id: request.body.id,
      password: hashedPwd,
      name: request.body.name,
      role: request.body.role,
      profilePicture: "", // currently no use. May be in future.
    });

    // Save the new user..
    const user = await newUser.save();
    // After successful save..!!
    // Remove the password field before sending..
    const userModified = Object.keys(user).reduce((object, key) => {
      if (key !== "password") {
        object[key] = user[key];
      }
      return object;
    }, {});
    response.status(200).json(userModified);
    console.log(
      "[SUCCESS] New user has with default password is successfully Created. User is requested to change in first login."
    );
  } catch (error) {
    response.status(500).json(error);
    console.log("[ERROR] New user Registration failed. Desc: " + error);
  }
});

// Deletion....
router.delete("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  // if (user.username === request.body.username) {
  // Delete the user..
  try {
    //await Permission.findByIdAndDelete(request.params.id); -- or alternatively like below..
    await user.delete();
    console.log("[SUCCESS] User deleted successfully.");
    response.status(200).json("User deleted successfully");
  } catch (error) {
    console.error("[ERROR] User deletion error.");
    response
      .status(500)
      .json("User deletion failed. Reason: Received invalid userId");
  }
});

// Updation..
router.put("/:id", async (request, response) => {
  // Small validation..

  console.log("[INFO] Received update request for id: ", request.params.id);
  try {
    // Get the user..
    const updatedUserDetails = await User.findByIdAndUpdate(
      request.params.id,
      {
        $set: request.body,
      }
      // { new: true }
    );
    console.log("[SUCCESS] User updated successfully");
    response.status(200).json(updatedUserDetails);
  } catch (error) {
    console.error("[ERROR] User updation failed. Error: " + error);
  }
});

// Get all the users.. -- useful in showing all the users to the admin.. -- with the facility of fltering by "username" and "category"
router.get("/", async (request, response) => {
  const requiredUserPosts = request.query.user;
  const requiredCategory = request.query.category;
  let users;
  try {
    // Filtration of users...
    // if (requiredUserPosts)
    //   users = await Permission.find({ username: requiredUserPosts });
    // else if (requiredCategory)
    //   users = await Permission.find({
    //     categories: {
    //       $in: [requiredCategory],
    //     },
    //   });
    // // Get all the users..
    // else
    users = await User.find({}, { password: 0 }); // dont get passwordt

    // Send the retrieved (filtered) users..
    console.info("[SUCCESS] Multiple users data retrieved successfully");
    response.status(200).json(users);
  } catch (error) {
    console.error("[ERROR] Error in retrieving all users.");
    response.status(500).json("Sorry, Unable to retrieve users.");
  }
});

module.exports = router;
