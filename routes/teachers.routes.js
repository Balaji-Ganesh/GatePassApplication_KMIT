const express = require("express");
const router = express.Router();
const Teachers = require("../config");

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

// getting all the users..
router.get("/", async (request, response) => {
  try {
    //  get the teachers data..
    const teachersSnapshot = await Teachers.get();
    const teachersList = teachersSnapshot.docs.map((doc) => ({
      id: doc.id,
      role: "Teacher",
      ...doc.data(),
    }));
    const studentsSnapshot = await Teachers.get();
    const studentsList = studentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      role: "Student",
      ...doc.data(),
    }));
    
    response.status(200).send(studentsList);
  } catch (error) {
    response.status(500).json({
      msg: "Error in fetching users. Please try again.",
      error: error,
    });
  }
});

// updating a user..
router.patch("/", async (request, response) => {
  try {
    const id = request.body.id; // get the Id of the user to be deleted.
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
router.delete("/", async (request, response) => {
  try {
    await Teachers.doc(request.body.id).delete(); // currently not performint any filtration, but good  to do.
    response.status(200).json({ msg: "Deletion Success" });
  } catch (error) {
    response.status(500).json({
      msg: "Error in deleting user. Please try again.",
      error: error,
    });
  }
});
module.exports = router;
