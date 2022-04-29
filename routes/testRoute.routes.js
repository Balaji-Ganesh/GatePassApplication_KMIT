const router = require("express").Router();

router.get("/", (request, response) => {
  response.send("API working");
});

// exporting..
module.exports = router;