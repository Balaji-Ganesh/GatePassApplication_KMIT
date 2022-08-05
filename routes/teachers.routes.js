const express = require("express");
const router = express.Router();
const db = require("../config");

const Teachers = db.collection("teachers");

// Creating a new user
router.post("/", async (request, response) => {
  try {
    const data = request.body;
    await Teachers.add({ ...data }); // adding the data to the firebase..
    response.status(200).json({ msg: "User creation success." });
  } catch (error) {
    response.status(500).json({
      msg: "Error in creation of new user. Please try again.",
      error: error,
    });
  }
});

// getting all the teachers profiles..
router.get("/", async (request, response) => {
  try {
    console.log("Came to fetch teachers data");
    //  get the teachers data..
    const teachersSnapshot = await Teachers.get();
    console.log("snapshot: " + teachersSnapshot);
    const teachersList = teachersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    response.status(200).send(teachersList);
  } catch (error) {
    response.status(500).json({
      msg: "Error in fetching teachers profiles. Please try again.",
      error: error,
    });
  }
});

// updating a user..
router.put("/:id", async (request, response) => {
  try {
    const id = request.params.id; // get the Id of the user to be deleted.
    delete request.body.id; // erase `id` from the body, as document doesn't contain id.
    await Teachers.doc(id).update(request.body); // currently not performint any filtration, but good  to do.
    response.status(200).json({ msg: "Updation Success" });
  } catch (error) {
    response.status(500).json({
      msg: "Error in updating user. Please try again.",
      error: error,
    });
  }
});

// deleting a user..
router.delete("/:id", async (request, response) => {
  try {
    await Teachers.doc(request.params.id).delete(); // currently not performint any filtration, but good  to do.
    response.status(200).json({ msg: "Deletion Success" });
  } catch (error) {
    response.status(500).json({
      msg: "Error in deleting user. Please try again.",
      error: error,
    });
  }
});
module.exports = router;
