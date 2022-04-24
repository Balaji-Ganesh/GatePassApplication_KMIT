// take reference from permissions.js in api
const router = require("express").Router();
const Permission = require("../models/Permission.model");

// Creation of a new permission..
router.post("/", async (request, response) => {
  const permission = new Permission(request.body); // create the instance of new permission..
  /// Save the permission..
  try {
    console.log("[INFO] Permission: ", permission);
    console.log("[INFO] request.body.filename: ", request.body.filename);
    const savedPermission = await permission.save();
    console.log("[SUCCESS] Permission created successfully.");
    response.status(200).json(savedPermission);
  } catch (error) {
    console.error("[ERROR] Permission creation failed/interrupted.");
    response
      .status(500)
      .json(
        "Error occured in creating permission. \nDetailed error report: " +
          error
      );
  }
});

// Updation..
router.put("/:id", async (request, response) => {
  // Small validation..
  try {
    console.log("[INFO] id: ", request.params.id);
    const permission = await Permission.findById(request.params.id);
    if (permission.username === request.body.username) {
      try {
        // Get the permission..
        const updatedPost = await Permission.findByIdAndUpdate(
          request.params.id,
          {
            $set: request.body,
          },
          { new: true }
        );
        console.log("[SUCCESS] Permission updated successfully");
        response.status(200).json(updatedPost);
      } catch (error) {
        console.error("[ERROR] Permission updation failed. Error: " + error);
      }
    } else {
      response
        .status(500)
        .json(
          "You can't update someone else's permissions. Insufficient rights"
        );
      console.warn(
        "[WARNING] Received request of updation from non-author. Error: " +
          error
      );
    }
  } catch (error) {
    console.warn(
      "[WARNING] Received request of updation from non-author. Error: " + error
    );
    response
      .status(401)
      .json(
        "You can't update/edit someone else's permission. Insufficient rights."
      );
  }
});

// Deletion....
router.delete("/:id", async (request, response) => {
  // Small validation..
  try {
    const permission = await Permission.findById(request.params.id);
    if (permission.username === request.body.username) {
      // Delete the permission..
      try {
        //await Permission.findByIdAndDelete(request.params.id); -- or alternatively like below..
        await permission.delete();
        console.log("[SUCCESS] Permission deleted successfully.");
        response.status(200).json("Permission deleted successfully");
      } catch (error) {
        console.error("[ERROR] Permission deletion error.");
        response.status(500).json("Permission deletion failed");
      }
    } else {
      console.warn(
        "[WARNING] Received request of deletion from non-author. Error: " +
          error
      );
      response
        .status(500)
        .json("You can't delete someone else's permissions. Insufficient rights");
    }
  } catch (error) {
    console.warn(
      "[WARNING] Received request of DELETION from non-author. Error: " + error
    );
    response
      .status(401)
      .json("You can't delete someone else's permission. Insufficient rights.");
  }
});

// GET..
router.get("/:id", async (request, response) => {
  console.info(
    `[INFO] Received GET request to retrieve permission of id: ${request.params.id}`
  );
  try {
    const permission = await Permission.findById(request.params.id); // to search based on _id of mongodb
    // const permission = await Permission.find({"studentId":request.params.id})    // uncomment this, if to search via roll no
    if (permission != null) {
      console.log(
        `[SUCCESS] Permission retrieved successfully. Response: ${permission}`
      );
      response.status(200).json(permission);
    } else {
      console.warn(
        "[WARNING] Trying to access invalid permission or a deleted permission."
      );
      response
        .status(500)
        .json(
          "Please re-check the permission-id,  \n Detailed Error: " + error
        );
    }
  } catch (error) {
    console.error("[ERROR] Permission retrieval failed.\nError: " + error);
    response
      .status(500)
      .json(
        "Cannot retrieve permission. It might have deleted by the admin. \nDetailed Error: " +
          error
      );
  }
});

// Get all the permissions.. -- useful in showing all the permissions to the user.. -- with the facility of fltering by "username" and "category"
router.get("/", async (request, response) => {
  const requiredUserPosts = request.query.user;
  const requiredCategory = request.query.category;
  let permissions;
  try {
    // Filtration of permissions...
    if (requiredUserPosts)
      permissions = await Permission.find({ username: requiredUserPosts });
    else if (requiredCategory)
      permissions = await Permission.find({
        categories: {
          $in: [requiredCategory],
        },
      });
    // Get all the permissions..
    else permissions = await Permission.find();

    // Send the retrieved (filtered) permissions..
    console.info("[SUCCESS] Multiple permissions retrieved successfully");
    response.status(200).json(permissions);
  } catch (error) {
    console.error("[ERROR] Error in retrieving all permissions.");
    response.status(500).json("Sorry, Unable to retrieve permissions.");
  }
});

// exporting..
module.exports = router;
