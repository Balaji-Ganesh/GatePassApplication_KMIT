import React, { useState } from "react";
import SignIn from "./components/SignIn";
import DashboardWrapper from "./components/DashboardWrapper";

function App() {
  // const [signInSuccess, setSignInSuccess] = useState(false); /// set to true, to test signIn..
  return (
    <>
      {/* <Router>
        <Routes>
          <Route exact path="/" component={SignIn} />
          <Route path="/dashboard" component={DashboardWrapper} />
        </Routes>
      </Router> */}
      {/* {signInSuccess ? <DashboardWrapper /> : <SignIn />} */}
      <SignIn />
      {/* <DashboardWrapper/> */}
    </>
  );
}

export default App;
