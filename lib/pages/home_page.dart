import 'package:flutter/material.dart';
import 'package:rakshak/pages/authentication/phone_number_login.dart';

import 'package:rakshak/utils/constants.dart';
import 'package:rakshak/widgets/history.dart';
import 'package:rakshak/widgets/profile_drawer.dart';
import 'package:rakshak/widgets/qr_code_scanner.dart';


class HomePage extends StatefulWidget{
  static const routeName = "/home";
  HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>{
  int _pageSelectionIdx = 0;

  static const List<Widget> _widgetOptions = <Widget>[
    QRCodeScanner(),
    History()
  ];

  @override
  Widget build(BuildContext context){
    return SafeArea(
      child: Scaffold(
        appBar: AppBar(
          title: const Text("Rakshak"),  // make this transparent
          actions: <Widget>[
            IconButton(onPressed: (){
              // Here set back to false..
              Constants.sharedPrefs.setBool("isLoggedIn", false);                 /// set to false..
              Constants.sharedPrefs.setString("username", "<no_name>");                    //set to empty
              Navigator.of(context).pushReplacement(MaterialPageRoute(builder: (context)=>PhoneNumberLogin()));       // Navigate to the login screen
            }, icon: const Icon(Icons.logout),
              tooltip: "Logout",
            )
          ],
        ),
        body: Center(
          child: _widgetOptions.elementAt(_pageSelectionIdx),
        ),
        backgroundColor: Colors.grey[300],
        bottomNavigationBar: BottomNavigationBar(
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
                icon: Icon(Icons.qr_code_scanner_outlined),
                label: 'QR Scanner'
            ),
            BottomNavigationBarItem(
                icon: Icon(Icons.list),
                label: 'History'
            ),
          ],
          onTap: (int idx){
            setState((){
              _pageSelectionIdx = idx;
            });
          },
          currentIndex: _pageSelectionIdx,
          selectedItemColor: Colors.blue[400],
        ),
        drawer: ProfileDrawer(),
      ),
    );
  }
}
