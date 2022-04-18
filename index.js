// Importing required packages..
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Importing routes//
const authenticationRoute = require("./routes/authentication.routes");
const userRoute = require("./routes/users.routes");
const permissionRoute = require("./routes/permissions.routes");

/** Few configurations.. */
const app = express(); /// Make the application to use express..
app.use(express.json()); // For handling JSON by type..
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "/assets/images"))
); // to set the images folder public..

/** ----------------------------------- Connection to database -------------------------------- **/
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true, -- getting error if included. But, Tutorial mentions, presence of this line.
    //useFindAndModify: true // if getting deprecation warning..
  })
  .then(console.log("[SUCCESS] Database connection successful"))
  .catch((error) =>
    console.log("[ERROR] Database connection failed. Error: \n" + error)
  );
/** --------------------------------------------------------------------------------------------- */

/** --------------------------------------------- Routes forwarding-------------------------------- */
// Authentication route..
app.use("/api/authentication", authenticationRoute);
// User related routes..
app.use("/api/users", userRoute);
// Posts related routes..
app.use("/api/permission", permissionRoute);

// testing..
app.use("/api", (request, response) => {
  response.send("Hello Govinda");
});
/* ------------------------------------------------------------------------------------------------ */

/** -------------------------------- Uploading images to the server ----------------------------- */
const storage = multer.diskStorage({
  destination: (request, file, callbackFn) => {
    callbackFn(null, "assets/images"); // The path, where the images has to be placed..
  },
  filename: (request, file, callbackFn) => {
    callbackFn(null, request.body.filename);
  },
});

const upload = multer({ storage: storage });
// uploading to server..
app.post("/api/upload", upload.single("file"), (request, response) => {
  response
    .status(200)
    .json(
      "                                                                                                                                                                                                                                                                                                                                                                                                                            File has been uploaded"
    );
});

/* --------------------------------------- Lines added for deployment in heroku ---------------------------*/
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});
/** --------------------------------------------------------------------------------------------- */

/** -------------------------------- Start listening the server. -----------------------------.**/
const PORT = "4000";
app.listen(process.env.PORT || PORT, () => {
  console.log("Server listening on port: " + PORT);
  /* ---------------------------------------------------------------------------------------------*/
});
