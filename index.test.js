const express = require("express");

/** Few configurations.. -- Setting Middlewares..*/
const app = express(); /// Make the application to use express..
app.use(express.json()); // For handling JSON by type..

const testRoute = require("./routes/testRoute.routes");
const permissionRoute = require("./routes.old/permissions.routes")

app.use("/test", testRoute);

app.get("/api", (request, response) => {
  response.send("API working");
});

/** -------------------------------- Start listening the server. -----------------------------.**/
const PORT = "4000";
app.listen(process.env.PORT || PORT, () => {
  console.log("Server listening on port: " + PORT);
  /* ---------------------------------------------------------------------------------------------*/
});
