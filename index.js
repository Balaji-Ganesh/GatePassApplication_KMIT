// Importing required packages..
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Importing routes//
// const authenticationRoute = require("./routes/authentication.routes");
// const userRoute = require("./routes/users.routes");
// // const permissionRoute = require("./routes/permissions.routes");
const permissionRoute = require("./routes/Permissions.routes");
const userRoute = require("./routes/Users.routes");
// const testRoute = require("./routes/testRoute.routes")

/** Few configurations.. */
const app = express(); /// Make the application to use express..
app.use(express.json()); // For handling JSON by type..
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "/assets/images"))
); // to set the images folder public..

/** ----------------------------------- Connection to database -------------------------------- **/
mongoose
  .connect(process.env.MONGO_URL_SHIVA, {
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
// app.use("/api/authentication", authenticationRoute);
// // User related routes..
// app.use("/api/users", userRoute);
// // Posts related routes..
app.use("/api/permission", permissionRoute);
app.use("/api/users", userRoute);

// app.use("/api/test", testRoute);
// testing..
app.use("/api", (request, response) => {
  response.send("Hello Govinda");
});
/* ------------------------------------------------------------------------------------------------ */

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
