// Loading the required libraries..
const express = require("express");
const cors = require("cors");
// const teacherRoutes = require("./routes/teachers.routes");
// const studentRoutes = require("./routes/students.routes");
// const permissionRoutes = require("./routes/permissions.routes");
// const authenticationRoute = require("./routes/authentication.routes");
require("dotenv").config();

// Performing necessary configurations.. -- connecting middlewares
const app = express();

app.use(express.json());
app.use(cors());

/* handle various routes.. */
// app.use("/api/teachers", teacherRoutes);
// app.use("/api/students", studentRoutes);
// app.use("/api/permissions", permissionRoutes);
// app.use("/api/authenticate", authenticationRoute);

// dummy route..
app.get("/", (request, response) => {
  console.log("A request from user");
  response.status(200).json("Hello");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
