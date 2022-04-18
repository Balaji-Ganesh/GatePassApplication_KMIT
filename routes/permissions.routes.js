// take reference from posts.js in api
const router = require("express").Router();
const Post = require("../models/Permission.model");

// Creation of a new post..
router.post("/", async (request, response) => {
  const permission = new Post(request.body); // create the instance of new post..
  /// Save the post..
  try {
    console.log("[INFO] Post: ", permission);
    console.log("[INFO] request.body.filename: ", request.body.filename);
    const savedPost = await permission.save();
    console.log("[SUCCESS] Post created successfully.");
    response.status(200).json(savedPost);
  } catch (error) {
    console.error("[ERROR] Post creation failed/interrupted.");
    response
      .status(500)
      .json(
        "Error occured in creating permission. \nDetailed error report: " + error
      );
  }
});

// Updation..
router.put("/:id", async (request, response) => {
  // Small validation..
  try {
    console.log("[INFO] id: ", request.params.id);
    const permission = await Post.findById(request.params.id);
    if (permission.username === request.body.username) {
      try {
        // Get the permission..
        const updatedPost = await Post.findByIdAndUpdate(
          request.params.id,
          {
            $set: request.body,
          },
          { new: true }
        );
        console.log("[SUCCESS] Post updated successfully");
        response.status(200).json(updatedPost);
      } catch (error) {
        console.error("[ERROR] Post updation failed. Error: " + error);
      }
    } else {
      response
        .status(500)
        .json("You can't update someone else's permissions. Insufficient rights");
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
      .json("You can't update/edit someone else's post. Insufficient rights.");
  }
});

// Deletion....
router.delete("/:id", async (request, response) => {
  // Small validation..
  try {
    const post = await Post.findById(request.params.id);
    if (post.username === request.body.username) {
      // Delete the post..
      try {
        //await Post.findByIdAndDelete(request.params.id); -- or alternatively like below..
        await post.delete();
        console.log("[SUCCESS] Post deleted successfully.");
        response.status(200).json("Post deleted successfully");
      } catch (error) {
        console.error("[ERROR] Post deletion error.");
        response.status(500).json("Post deletion failed");
      }
    } else {
      console.warn(
        "[WARNING] Received request of deletion from non-author. Error: " +
          error
      );
      response
        .status(500)
        .json("You can't delete someone else's posts. Insufficient rights");
    }
  } catch (error) {
    console.warn(
      "[WARNING] Received request of DELETION from non-author. Error: " + error
    );
    response
      .status(401)
      .json("You can't delete someone else's post. Insufficient rights.");
  }
});

// GET..
router.get("/:id", async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    // if (post != null) {
    console.log("[SUCCESS] Post retrieved successfully.");
    response.status(200).json(post);
    //   } else {
    //       console.warn("[WARNING] Trying to access invalid post or a deleted post.");
    //       response.status(500).json("Please re-check the post-id,  \n Detailed Error: "+error)
    //   }
  } catch (error) {
    console.error("[ERROR] Post retrieval failed.\nError: " + error);
    response
      .status(500)
      .json(
        "Cannot retrieve post. It might have deleted by the author. \nDetailed Error: " +
          error
      );
  }
});

// Get all the posts.. -- useful in showing all the posts to the user.. -- with the facility of fltering by "username" and "category"
router.get("/", async (request, response) => {
  const requiredUserPosts = request.query.user;
  const requiredCategory = request.query.category;
  let posts;
  try {
    // Filtration of posts...
    if (requiredUserPosts)
      posts = await Post.find({ username: requiredUserPosts });
    else if (requiredCategory)
      posts = await Post.find({
        categories: {
          $in: [requiredCategory],
        },
      });
    // Get all the posts..
    else posts = await Post.find();

    // Send the retrieved (filtered) posts..
    console.info("[SUCCESS] Multiple posts retrieved successfully");
    response.status(200).json(posts);
  } catch (error) {
    console.error("[ERROR] Error in retrieving all posts.");
    response.status(500).json("Sorry, Unable to retrieve posts.");
  }
});

// exporting..
module.exports = router;