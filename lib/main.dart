// library imports
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:rakshak/pages/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:easy_splash_screen/easy_splash_screen.dart';
// local imports..
import 'package:rakshak/pages/home_page.dart';
import 'package:rakshak/pages/authentication/phone_number_login.dart';
import 'package:rakshak/utils/constants.dart';
import 'package:flutter/services.dart';


Future main() async {
  WidgetsFlutterBinding.ensureInitialized();
//  WidgetsFlutterBinding.ensureInitialized();
  Constants.sharedPrefs = await SharedPreferences.getInstance(); // Initializing here..
  await Firebase.initializeApp();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp])
      .then((_) {
    runApp(new App());
  });
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        debugShowCheckedModeBanner: false,
        home: SplashScreenApp(),
      theme: ThemeData(
          primarySwatch: Colors
              .purple // Choose a primary color, we'll be getting different shades of it
      ),
    );
  }
}

class SplashScreenApp extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return EasySplashScreen(
      logo: Image.asset(
          'images/rakshakLogo.png'),
      logoWidth: 60,
      title: Text(
        "Rakshak",
        style: TextStyle(
          fontSize: 26,
          fontWeight: FontWeight.bold,
        ),
      ),
      backgroundColor: Colors.grey.shade400,
      showLoader: true,
      loadingText: Text("© Gate Pass Application"),
      loaderColor: Colors.blueGrey,
      navigator: RakshakApp(),
      durationInSeconds: 5,
    );
  }
}

class RakshakApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      //home: HomePage(),
      body: (Constants.sharedPrefs.getBool("isLoggedIn") ?? false) == true
          ? HomePage()//RakshakTests()
          //? Testing()
          : PhoneNumberLogin(),
      /*
      routes: {
        LoginPage.routeName: (context) => LoginPage(),
        HomePage.routeName: (context) => HomePage(greetings: 'main.dart'),
        // PermissionValidator.routeName: (context) => PermissionValidator(rollNo: rollNo) -- can't pas data this way
      },*/
    );
  }
}