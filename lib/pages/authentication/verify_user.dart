import 'package:flutter/material.dart';
import 'package:rakshak/pages/authentication/otp_entry.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class VerifyUser extends StatefulWidget {

  String mobileNumber;
  VerifyUser({Key? key, required this.mobileNumber}) : super(key: key);
  @override
  State<VerifyUser> createState() => _VerifyUserState();
}
enum Status{PENDING, ERROR, USER_FOUND, USER_NOT_FOUND}

class _VerifyUserState extends State<VerifyUser> {
  var dataRetrievalStatus=Status.PENDING;
  void initState(){
    checkMobileNumberPresenceInFirebase(widget.mobileNumber);
  }

  void moveToNextState(){
    // Move to the next step, when found to be valid
    if(dataRetrievalStatus == Status.USER_FOUND)
      Navigator.of(context).push(MaterialPageRoute(
          builder: (context) => OTPEntryScreen(mobileNumber: widget.mobileNumber)));
    // in case of false, the below widget gets rendered - prevents moving to next step.
  }

  // Helper methods..
  checkMobileNumberPresenceInFirebase(String mobileNumber)async{
    // Contact the firebase and verify mobile number presence
    CollectionReference gatekeepers = FirebaseFirestore.instance.collection('gatekeepers');
    try {
      QuerySnapshot obj = await gatekeepers
          .where("mobileNumber", isEqualTo: widget.mobileNumber) // get the data of the passed mobileNumber.
          .get();

      if (obj.docs.length > 0) {  // When found..
        dataRetrievalStatus = Status.USER_FOUND;
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text("Mobile number found. Welcome "+obj.docs.first["name"]+"..!!\nEnter OTP to proceed further.")));
        moveToNextState();
        setState(() {}); // update the state..
      }
      else{
        dataRetrievalStatus = Status.USER_NOT_FOUND;
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text("Sorry..!! Mobile number not registered. \nPlease re-check the entered mobile number.\nPlease contact administrator if problem still persists.")));
        print("[INFO] No such user found");
        Navigator.pop(context); // go back to the screen to edit the mobile number
      }
    }on Exception catch(error){
      dataRetrievalStatus = Status.ERROR;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(error.toString())));
      print("[ERROR]"+error.toString());
      setState(() {});  // update the state to display the error message instead of progress indicator
    }
  }

  // UI gets build, when invalid.
  // Also provide the option to edit the mobile-number.
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: dataRetrievalStatus == Status.PENDING
          ? CircularProgressIndicator()
          : dataRetrievalStatus ==  Status.USER_NOT_FOUND
            ? Text("Invalid User")
            : Text("An error occured in validation.")
      )
    );
  }
}