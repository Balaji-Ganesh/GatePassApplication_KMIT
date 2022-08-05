const express = require("express");
const router = express.Router();
const db = require("../config");

const Students = db.collection("students");

// Creating a new user
router.post("/", async (request, response) => {
  console.log("[DEBUG] Received response for adding user details: ");
  console.log(response);

  try {
    const data = request.body;
    await Students.add({ ...data }); // adding the data to the firebase..
    response.status(200).json({ msg: "User creation success." });
  } catch (error) {
    response.status(500).json({
      msg: "Error in creation of new user. Please try again.",
      error: error,
    });
  }
});

// getting all the student profiles..
router.get("/", async (request, response) => {
  try {
    const snapshot = await Students.get();
    const studentsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    //console.log("Received students data: " + studentsList);
    response.status(200).send(studentsList);
  } catch (error) {
    response.status(500).json({
      msg: "Error in fetching student profiles. Please try again.",
      error: error,
    });
  }
});

// updating a user..
router.put("/:id", async (request, response) => {
  console.log(
    "[DEBUG] Received response for editing user details: " + response.body
  );
  try {
    //const id = request.body.id; // get the Id of the user to be deleted.
    //delete request.body.id; // erase `id` from the body, as document doesn't contain id.
    await Students.doc(request.params.id).update(request.body); // currently not performint any filtration, but good  to do.
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
  const id = request.params.id;
  console.log("[DEBUG] Received response for adding user details: (id) " + id);
  console.log(response);

  try {
    await Students.doc(id).delete(); // currently not performint any filtration, but good  to do.
    response.status(200).json({ msg: "Deletion Success" });
  } catch (error) {
    response.status(500).json({
      msg: "Error in deleting user. Please try again.",
      error: error,
    });
  }
});
module.exports = router;
