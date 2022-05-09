import React, { useState } from "react";
import SignIn from "./components/SignIn";
import DashboardWrapper from "./components/DashboardWrapper";

function App() {
  const [signInSuccess, setSignInSuccess] = useState(true); /// set to true, to test signIn..
  return <>{signInSuccess ? <DashboardWrapper /> : <SignIn />}</>;
}

export default App;
