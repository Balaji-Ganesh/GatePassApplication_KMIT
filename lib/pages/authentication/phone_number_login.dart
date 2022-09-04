import 'package:flutter/material.dart';
import 'package:rakshak/pages/authentication/otp_entry.dart';
import 'package:rakshak/pages/authentication/verify_user.dart';

class PhoneNumberLogin extends StatefulWidget {
  PhoneNumberLogin({Key? key}) : super(key: key);

  @override
  State<PhoneNumberLogin> createState() => _PhoneNumberLoginState();
}

class _PhoneNumberLoginState extends State<PhoneNumberLogin> {
  TextEditingController _mobileNumumberController = TextEditingController();
  //RegExp regExp = RegExp()
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Column(
            children: [
              Container(
                margin: const EdgeInsets.only(top: 100),
                child: const Center(
                  child: Text("Phone Authentication",
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 28
                    ),
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(20),
                child: TextField(

                  controller: _mobileNumumberController,
                  decoration: const InputDecoration(
                    labelText: 'Mobile number',
                    hintText: "Please enter 10 digits mobile number",
                    prefix: Padding(
                      padding: EdgeInsets.all(4),
                      child: Text("+91"),
                    ),
                  ),
                  maxLength: 10,
                  keyboardType: TextInputType.number,
                ),
              ),
            ],
          ),

          Container(
              margin: const EdgeInsets.all(10),
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  if (_mobileNumumberController.text.length != 10  ) {
                    // have regex check before proceeding further.. should contain only numbers -- above condition not required
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                        content: Text(
                            "Please enter 10 digit valid mobile number")));
                  }
                  else {
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) =>
                            VerifyUser(
                                mobileNumber: _mobileNumumberController.text)));
                  }
                },
                child: const Text("Send OTP"),

              )
          )
        ],
      ),
    );
  }

}