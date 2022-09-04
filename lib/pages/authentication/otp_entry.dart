import 'dart:math';

import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:rakshak/pages/authentication/phone_number_login.dart';
import 'package:rakshak/pages/home_page.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

import '../../utils/constants.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';


class OTPEntryScreen extends StatefulWidget {
  String mobileNumber;

  OTPEntryScreen({Key? key, required this.mobileNumber}) : super(key: key);

  @override
  State<OTPEntryScreen> createState() => _OTPEntryScreenState();
}
enum Status { error, waiting }

class _OTPEntryScreenState extends State<OTPEntryScreen> {
  late String _verificationCode;

  FirebaseAuth auth = FirebaseAuth.instance;
  String? _verificationID;
  var _status = Status.waiting;
  String enteredOtp="";

  @override
  void initState() {
    super.initState();
    _verifyPhoneNumberBySendingOTP(); // calling this at beg, because need to send OTP to that mobile number
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      body: Column(
        children: <Widget>[
          Container(
              margin: EdgeInsets.only(top: 100),
              child: Text(
                "Verify +91 ${widget.mobileNumber}",
                style:
                const TextStyle(fontWeight: FontWeight.bold, fontSize: 26),
              )),
          _status != Status.error ?
          Container(
            margin: const EdgeInsets.only(top: 40),
            padding: const EdgeInsets.all(16.0),
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: PinCodeTextField(
              //controller: _otpEntryController,
              appContext: context,
              pastedTextStyle: TextStyle(
                color: Colors.green.shade600,
                fontWeight: FontWeight.bold,
                ),
              length: 6,
              obscureText: false,
              pinTheme: PinTheme(
                shape: PinCodeFieldShape.box,
                borderRadius: BorderRadius.circular(8),
                borderWidth: 0,
                fieldHeight: 50,
                fieldWidth: 40,
                activeFillColor: Colors.white,
                inactiveFillColor: Colors.white,
                selectedFillColor: Colors.white,
                activeColor: Colors.white,
              ),
              cursorColor: Colors.black,
              //hintCharacter: '0',
              hintStyle: TextStyle(color: const Color(0x36000000),),
              animationType: AnimationType.fade,
              animationDuration: const Duration(milliseconds: 300),
              enableActiveFill: true,
              keyboardType: TextInputType.number,
              boxShadows: const [
                BoxShadow(
                  offset: Offset(0, 1),
                  color: Colors.black12,
                  blurRadius: 10,
                )
              ],
              onChanged: (value) {
                print("Entered value: " + value);
                enteredOtp = value;
                if (enteredOtp.length == 6) { // as soon as entered full OTP..
                  // perform auth..
                  print("Going for verification");
                  _verifyOtpBySendingToFirebase(enteredCode: enteredOtp);
                }
/*              setState(() {
                  //currentText = value;
                });*/
              },
              onCompleted: (value){
                print("final value: "+value);
                _verifyOtpBySendingToFirebase(enteredCode: value);

              },),
            )
          )
              : Container(
              margin: const EdgeInsets.only(top: 80),
              padding: const EdgeInsets.all(16),
              child: const Text("Incorrect OTP, please try again.",
                style: TextStyle(color: Color(0xFFE57373),
                    fontSize: 20,
                    fontWeight: FontWeight.bold),)
          )
          ,

          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text("Didn't receive the OTP?"),
              TextButton(
                  onPressed: () async{
                    setState((){
                      this._status = Status.waiting;
                    });
                    _verifyPhoneNumberBySendingOTP();
                  },
                  child: const Text("Resend OTP")
              )
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text("Would like to edit number?"),
              TextButton(
                  onPressed: () {
                    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context)=>PhoneNumberLogin()));
                  },
                  child: const Text("Edit Mobile number")
              )
            ],
          ),
        ],
      ),
    );
  }

  Future _verifyPhoneNumberBySendingOTP() async {
    print("OTP sending");
    await auth.verifyPhoneNumber(
      phoneNumber: widget.mobileNumber,
      verificationCompleted: (PhoneAuthCredential credential) async { // This handler will only be called on Android devices which support automatic SMS code resolution.
        // Sign the user in (or link) with the auto-generated credential
        await auth.signInWithCredential(credential);

      },
      verificationFailed: (FirebaseAuthException e) async {
        print(e.message);
      },
      codeSent: (String verificationId, int? resendingToken) async { // When Firebase sends an SMS code to the device, this handler is triggered with a `verificationId` and `resendToken`
        // A note: A resendToken is only supported on Android devices, iOS devices will always return a null value.
        //otpVisibility = true;
        setState(() {
          this._verificationID = verificationId; // update with what firebase has sent.
        });
        //verificationID = verificationId;
      },
      codeAutoRetrievalTimeout: (String verificationId) async { },

    );
  }

  Future _verifyOtpBySendingToFirebase({String? enteredCode}) async {
    if (this._verificationID != null) {
      // prepare the credential
      PhoneAuthCredential credential = PhoneAuthProvider.credential(
          verificationId: this._verificationID!,
          smsCode: enteredCode!);
      // send the credential to authorize..
      await auth.signInWithCredential(credential)
          .then((value) {
        Fluttertoast.showToast(
            msg: "You have logged in successfully",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.CENTER,
            timeInSecForIosWeb: 1,
            backgroundColor: Colors.red,
            textColor: Colors.white,
            fontSize: 16.0
        );

        Constants.sharedPrefs.setBool("isLoggedIn", true);                 /// set to false..
        Navigator.push(context, MaterialPageRoute(builder: (context)=>HomePage()));
      })
          .whenComplete(() {})
          .onError((error, stackTrace) {
        setState(() {
          enteredOtp = "";
          this._status = Status.error;
        });
      });
    }
    else{
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: const Text("An error occured in verification")));
    }
  }
}
