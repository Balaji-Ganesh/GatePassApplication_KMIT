const express = require("express");
const router = express.Router();
const Permissions = require("../config");

// Creating a new permission
router.post("/", async (request, response) => {
  try {
    const data = request.body;
    await Permissions.add({ ...data }); // adding the data to the firebase..
    response.status(200).json({ msg: "Permission creation success." });
  } catch (error) {
    response.status(500).json({
      msg: "Error in creation of new permission. Please try again.",
      error: error,
    });
  }
});

// getting all the permissions..
router.get("/", async (request, response) => {
  try {
    const snapshot = await Permissions.get();
    const usersList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    response.status(200).send(usersList);
  } catch (error) {
    response.status(500).json({
      msg: "Error in fetching users. Please try again.",
      error: error,
    });
  }
});

// updating a permission..
router.patch("/", async (request, response) => {
  try {
    const id = request.body.id; // get the Id of the permision to be deleted.
    delete request.body.id; // erase `id` from the body, as document doesn't contain id.
    await Permissions.doc(id).update(request.body); // currently not performint any filtration, but good  to do.
    response.status(200).json({ msg: "Updation Success" });
  } catch (error) {
    response.status(500).json({
      msg: "Error in updating permission. Please try again.",
      error: error,
    });
  }
});

// deleting a permission..
router.delete("/", async (request, response) => {
  try {
    await Permissions.doc(request.body.id).delete(); // currently not performint any filtration, but good  to do.
    response.status(200).json({ msg: "Deletion Success" });
  } catch (error) {
    response.status(500).json({
      msg: "Error in deleting permission. Please try again.",
      error: error,
    });
  }
});

module.exports = router;
