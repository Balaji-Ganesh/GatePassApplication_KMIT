// This route <-- will deal with the permissions of student issued by the faculty
// take reference from posts.js in api
const router = require("express").Router();
// const Permission = require("../models.old/Permission.model");

const Permission = require("../models/Permission.model");

// GET..
router.get("/:id", async (request, response) => {
  console.info(
    `[INFO] Received GET request to retrieve permission of id: ${request.params.id}`
  );
  try {
    // const permission = await Permission.findById(request.params.id); // to search based on _id of mongodb
    const permission = await Permission.find({ RollNumber: request.params.id });
    // const permission = await Permission.find({"studentId":request.params.id})    // uncomment this, if to search via roll no
    // if(permission.length ==0)
    //   response.status(404).json("No such permission found");
    if (permission != null && permission.length > 0) {
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


// Get all the posts.. -- useful in showing all the posts to the user.. -- with the facility of fltering by "username" and "category"
router.get("/", async (request, response) => {
  try {
    const users = await Permission.find();  // using "users", so as to be consistent with Shiva's modelname.

    // Send the retrieved (filtered) posts..
    console.info("[SUCCESS] Multiple posts retrieved successfully");
    response.status(200).json(users);
  } catch (error) {
    console.error("[ERROR] Error in retrieving all posts.");
    response.status(500).json("Sorry, Unable to retrieve posts.");
  }
});


// exporting..
module.exports = router;
