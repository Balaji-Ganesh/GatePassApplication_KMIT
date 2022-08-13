// library imports
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:rakshak/pages/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';
// local imports..
import 'package:rakshak/pages/home_page.dart';
import 'package:rakshak/pages/authentication/phone_number_login.dart';
import 'package:rakshak/utils/constants.dart';

Future main() async {
  WidgetsFlutterBinding.ensureInitialized();
//  WidgetsFlutterBinding.ensureInitialized();
  Constants.sharedPrefs = await SharedPreferences.getInstance(); // Initializing here..
  await Firebase.initializeApp();
  runApp(RakshakApp());
}

class RakshakApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,       // remove the debug banner

      //home: HomePage(),
      home: (Constants.sharedPrefs.getBool("isLoggedIn") ?? false) == true
          ? HomePage()//RakshakTests()
          //? Testing()
          : PhoneNumberLogin(),
      // Depending on the login status.. first screen will be decided.
      theme: ThemeData(
          primarySwatch: Colors
              .purple // Choose a primary color, we'll be getting different shades of it
      ),
      /*
      routes: {
        LoginPage.routeName: (context) => LoginPage(),
        HomePage.routeName: (context) => HomePage(greetings: 'main.dart'),
        // PermissionValidator.routeName: (context) => PermissionValidator(rollNo: rollNo) -- can't pas data this way
      },*/
    );
  }
}