import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import ShowResponse from "./ShowResponse";
import DashboardWrapper from "./DashboardWrapper";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();

function Copyright() {
  return (
    <>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link
          color="inherit"
          href="https://github.com/shivrajbande/securitygaurd"
        >
          API
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link
          color="inherit"
          href="https://github.com/Balaji-Ganesh/GatePassApplication_KMIT/"
        >
          Dashboard
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [signInFailed, setSignInFailed] = useState(false);
  // const [cookiesActiveStatus, setCookiesActiveStatus] = useState(false);

  function handleSubmit(e) {
    setSignInFailed(false);
    e.preventDefault();
    var uniqueId = document.getElementById("uniqueId").value;
    var password = document.getElementById("pwd").value;
    console.log(uniqueId, password);
    // const api_url = "http://localhost:4001/api/authenticate";
    const api_url = "https://securitygaurd.herokuapp.com/api/authenticate/";

    const data = {
      Name: uniqueId,
      password: password,
    };
    axios
      .post(api_url, data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setSignInSuccess(true);
          setCookies(true, uniqueId);
          console.log("Cookies set. check: " + document.cookie);
        } else {
          console.log("Incorrect details");
          setSignInSuccess(false);
          setCookies(false, "");
        }
      })
      .catch((error) => {
        console.log(error);
        setSignInFailed(true);
      });
    console.log("Login status: " + signInSuccess);
  }
  const classes = useStyles();

  // Check the active status of the cookies..
  function setCookies(mode, id) {
    if (mode) {
      const d = new Date();
      d.setTime(d.getTime() + 30 * 60 * 1000); // for a session of 30min
      document.cookie = "adminUser=" + id + ";expires=" + d.toUTCString() + ";"; // set the cookie
    } else document.cookie = "adminUser=;"; // unset the cookiee..
  }
  // let cook = getCookie("adminUser");
  return (
    <>
      {/* {signInSuccess ? (
        () => navigate("/dashboard")
      ) : ( */}
      {signInSuccess ||
      (document.cookie.search("adminUser=") !== -1 &&
        document.cookie.length > 10) ? (
        <DashboardWrapper />
      ) : (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Typography component="h4" variant="p">
              Welcome to Niyantrak dashboard
            </Typography>
            <form className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="uniqueId"
                type="text"
                label="Username"
                name="uniqueId"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="pwd"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleSubmit}
              >
                Sign In
              </Button>
              {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
          {signInFailed && (
            <ShowResponse
              severity={"error"}
              message={"Login failed, please try again..!!"}
            />
          )}
        </Container>
      )}
      {/* // } */}
    </>
  );
}
