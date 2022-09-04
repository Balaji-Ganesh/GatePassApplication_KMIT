import 'package:flutter/material.dart';
import 'package:rakshak/pages/authentication/otp_entry.dart';
import 'package:rakshak/pages/authentication/verify_user.dart';
import 'package:intl_phone_number_input/intl_phone_number_input.dart';

class PhoneNumberLogin extends StatefulWidget {
  PhoneNumberLogin({Key? key}) : super(key: key);

  @override
  State<PhoneNumberLogin> createState() => _PhoneNumberLoginState();
}

class _PhoneNumberLoginState extends State<PhoneNumberLogin> {
  late String phoneNumber;
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
                padding: EdgeInsets.all(6.0),
                margin: EdgeInsets.symmetric(horizontal: 5),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8.0),
                  color: Colors.white,
                ),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: InternationalPhoneNumberInput(
                    //countries: ['IN', 'SL'],  // Add more counties here
                    onInputChanged: (PhoneNumber number) {
                      phoneNumber=number.phoneNumber!;
                      print("Entered phone number: "+phoneNumber);
                    },
                    onInputValidated: (bool value) {
                      print(value);
                    },
                    selectorConfig: SelectorConfig(
                      selectorType: PhoneInputSelectorType.BOTTOM_SHEET,
                    ),
                    spaceBetweenSelectorAndTextField: 0,
                    ignoreBlank: false,
                    autoValidateMode: AutovalidateMode.disabled,
                    selectorTextStyle: TextStyle(color: Colors.black),
                    initialValue: PhoneNumber(isoCode: 'IN'),  //enter country code for the default value
                    formatInput: true,
                    keyboardType:
                      TextInputType.numberWithOptions(signed: true, decimal: false),
                    inputBorder: OutlineInputBorder(),
                    hintText: 'Enter phone number',
                  ),
                ),
              ),
            ],
          ),

          Container(
              margin: const EdgeInsets.all(10),
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  if (phoneNumber.length != 13  ) { // +3 for "+91" - country code. May vary from country to country.
                    // have regex check before proceeding further.. should contain only numbers -- above condition not required
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                        content: Text(
                            "Please enter 10 digit valid mobile number")));
                  }
                  else {
                    Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) =>
                            VerifyUser(
                                mobileNumber: phoneNumber)));
                  }
                },
                child: const Text("Verify & Send OTP"),

              )
          )
        ],
      ),
    );
  }

}