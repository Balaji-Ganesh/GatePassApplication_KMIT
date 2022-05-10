import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import axios from "axios";
// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://github.com/Balaji-Ganesh/GatePassApplication_KMIT/"
      >
        KMITians
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
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

  function handleSubmit(e) {
    e.preventDefault();
    var uniqueId = document.getElementById("uniqueId").value;
    var password = document.getElementById("pwd").value;
    console.log(uniqueId, password);
    // const api_url = "http://localhost:4000/api/authenticate";
    const api_url = "https://securitygaurd.herokuapp.com/api/authenticate/";

    const data = {
      Name: uniqueId,
      password: password,
    };
    axios
      .post(api_url, data)
      .then((response) => {
        console.log(response);
        if (response.status == 200) setSignInSuccess(true);
        else {
          console.log("Incorrect details");
          setSignInSuccess(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const classes = useStyles();

  return (
    <>
      {/* {signInSuccess ? (
        () => navigate("/dashboard")
      ) : ( */}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
      </Container>
      {/* // } */}
    </>
  );
}
