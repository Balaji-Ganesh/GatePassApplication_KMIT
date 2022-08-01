import 'package:flutter/material.dart';
import 'home_page.dart';
import 'package:rakshak/utils/constants.dart';

class LoginPage extends StatefulWidget {
  static const routeName = "/login";

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("Rakshak Login"),
        ),
        body: Stack(
          fit: StackFit.expand,
          children: <Widget>[
            Image.asset(
              "images/mountain.jpg",
              fit: BoxFit.cover,
              color: Colors.grey.withOpacity(0.5),
              colorBlendMode: BlendMode.darken,
            ),
            Center(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Center(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(20),
                        child: Form(
                          key: _formKey,
                          child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Image.asset(
                                  "images/enter.png",
                                  height: 80,
                                  width: 80,
                                ),
                                SizedBox(
                                  height: 10,
                                ),
                                Text(
                                  "Login",
                                  style: TextStyle(
                                      fontSize: 25,
                                      fontWeight: FontWeight.bold),
                                ),
                                SizedBox(
                                  height: 20,
                                ),
                                TextFormField(
                                  controller: _usernameController,
                                  obscureText: false,
                                  keyboardType: TextInputType.text,
                                  decoration: InputDecoration(
                                      hintText: "Please enter username",
                                      labelText: "Username"),
                                  validator: (string) {
                                    // TODO: Implement validator
                                    //if ( string != null && string.length > 5 )
                                    //   return true?;
                                  },
                                ),
                                SizedBox(
                                  height: 30,
                                ),
                                TextFormField(
                                  controller: _passwordController,
                                  obscureText: true,
                                  keyboardType: TextInputType.text,
                                  decoration: InputDecoration(
                                      hintText: "Enter password",
                                      labelText: "Password"),
                                  validator: (string) {
                                    // TODO: Implement validator
                                  },
                                ),
                                SizedBox(
                                  height: 20,
                                ),
                                ElevatedButton(
                                  child: Text("Login"),
                                  onPressed: () {
                                    // _formKey.currentState.validate(); // perform validation
                                    var uname = _usernameController
                                        .text; // for now assuming it won't be null .. validtion pending..
                                    var password = _passwordController.text;

                                    if (uname.length > 5) {
                                      Constants.sharedPrefs.setString(
                                          "username", _usernameController.text);
                                      /// REMEMBER: do the next ONLY after successful login -- i.e., successful response from the server
                                      /// -- at that time, get the username -- few crucial details in shared prefs to show in profile section
                                      Constants.sharedPrefs.setBool(
                                          "isLoggedIn",
                                          true); // set this to true, so to prevent opening this upon first open
                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(SnackBar(
                                          content: Text(
                                              "Login sucessful. \nWelcome to the application.")));
                                      Navigator.pushReplacementNamed(
                                          context, HomePage.routeName, arguments: {"hello"});
                                    }
                                  },
                                ),
                              ]),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            )
          ],
        ));
  }
}
