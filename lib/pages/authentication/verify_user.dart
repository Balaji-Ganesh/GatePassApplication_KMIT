import 'package:flutter/material.dart';
import 'package:rakshak/pages/authentication/otp_entry.dart';

class VerifyUser extends StatefulWidget {

  String mobileNumber;
  VerifyUser({Key? key, required this.mobileNumber}) : super(key: key);
  @override
  State<VerifyUser> createState() => _VerifyUserState();
}

class _VerifyUserState extends State<VerifyUser> {
  bool isPresent=false;
  void initState(){
    checkMobileNumberPresenceInFirebase(widget.mobileNumber);
    // Move to the next step, when found to be valid
    if(isPresent)
      Navigator.of(context).push(MaterialPageRoute(
          builder: (context) => OTPEntryScreen(mobileNumber: widget.mobileNumber)));
    // in case of false, the below widget gets rendered - prevents moving to next step.
  }

  // Helper methods..
  checkMobileNumberPresenceInFirebase(String mobileNumber){
    // Contact the firebase and verify
    // If present, update the `isPresent` to true

  }

  // UI gets build, when invalid.
  // Also provide the option to edit the mobile-number.
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Center(child: Text("Invalid User")),
    );
  }
}