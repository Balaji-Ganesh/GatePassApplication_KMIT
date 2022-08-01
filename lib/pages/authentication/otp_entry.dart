import 'dart:math';

import 'package:flutter/material.dart';
import 'package:pinput/pinput.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:rakshak/pages/authentication/phone_number_login.dart';
import 'package:rakshak/pages/home_page.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../../utils/constants.dart';

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
  TextEditingController _otpEntryController = TextEditingController();
  String? _verificationID;
  var _status = Status.waiting;

  @override
  void initState() {
    super.initState();
    _verifyPhoneNumberBySendingOTP(); // calling this ate beg, because need to send OTP to that mobile number
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
          //Visibility(child: child)
          /*
          Padding(
            padding: const EdgeInsets.all(30),
            child: Pinput(

              length: 6,
              defaultPinTheme: defaultPinTheme,
              focusedPinTheme: focusedPinTheme,
              submittedPinTheme: focusedPinTheme,
              showCursor: true,

              onCompleted: (pin) {
                print("entered pin: " + pin);
                Navigator.of(context).push(MaterialPageRoute(builder: (context)=>HomePage(greetings: 'greetings')));
              },
              controller: _otpEntryController,
              pinAnimationType: PinAnimationType.fade,
              //submittedPinTheme: PinTheme,
              onSubmitted: (pin) async {
                try {
                  await FirebaseAuth.instance
                      .signInWithCredential(PhoneAuthProvider.credential(
                          verificationId: _verificationCode, smsCode: pin))
                      .then((value) async {
                    if (value.user != null) {

                      Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  HomePage(greetings: 'greetings')),
                          (route) => false);
                    }
                    else{
                      ScaffoldMessenger.of(context)
                          .showSnackBar(const SnackBar(content: Text("Opps..!!")));
                    }
                  });
                } catch (e) {
                  ScaffoldMessenger.of(context)
                      .showSnackBar(SnackBar(content: Text(e.toString())));
                }
              },
              validator: (pin){
                if(pin  != '123456') return null;
                return 'Incorrect Pin';
              },
              errorText: 'hello',
              pinputAutovalidateMode: PinputAutovalidateMode.onSubmit,
            ),
          )
          */
          _status != Status.error ?
          Container(
            margin: const EdgeInsets.only(top: 40),
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _otpEntryController,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  letterSpacing: 30,
                  fontSize: 30
              ),
              maxLength: 6,
              onChanged: (enteredPin) async {
                print("Entered value: " + enteredPin);
                if (enteredPin.length == 6) { // as soon as entered full OTP..
                  // perform auth..
                  print("Going for verification");
                  _verifyOtpBySendingToFirebase(enteredCode: _otpEntryController.text);
                }
              },
            ),
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
                    Navigator.pop(context, MaterialPageRoute(builder: (context)=>PhoneNumberLogin()));
                  },
                  child: const Text("Edit Mobile number")
              )
            ],
          ),
        ],
      ),
    );
  }

/*
  _verifyPhone() async {
    await FirebaseAuth.instance.verifyPhoneNumber(
        phoneNumber: "+91${widget.mobileNumber}",
        verificationCompleted: (PhoneAuthCredential credential) async {
          print("in validation Completed");
          await FirebaseAuth.instance
              .signInWithCredential(credential)
              .then((value) async {
            if (value.user != null) {
              print("User logged in");
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (context)=>HomePage(greetings: 'greetings')));
            }
          });
        },
        verificationFailed: (FirebaseAuthException e) {
          print(e.message);
        },
        codeSent: (String verificationId, int? resendToken) {
          setState(() {
            _verificationCode = verificationId;
          });
        },
        codeAutoRetrievalTimeout: (String verificationId) {
          setState(() {
            _verificationCode = verificationId;
          });
        },
        timeout: const Duration(seconds: 60));
  }
  */
  Future _verifyPhoneNumberBySendingOTP() async {
    print("OTP sending");
    auth.verifyPhoneNumber(
      phoneNumber: "+91${widget.mobileNumber}",
      verificationCompleted: (PhoneAuthCredential credential) async { },
      verificationFailed: (FirebaseAuthException e) async {
        print(e.message);
      },
      codeSent: (String verificationId, int? resendingToken) async {
        //otpVisibility = true;
        setState(() {
          this._verificationID =
              verificationId; // update with what firebase has sent.
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
            msg: "You are logged in successfully",
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
          _otpEntryController.text = "";
          this._status = Status.error;
        });
      });
    }
  }
}
