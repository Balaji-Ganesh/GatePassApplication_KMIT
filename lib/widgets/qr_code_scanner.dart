// library imports
import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

// local imports
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:dotted_border/dotted_border.dart';
import 'package:rakshak/pages/fetch_permission.dart';
import 'package:rakshak/pages/permission_validator.dart';

class QRCodeScanner extends StatefulWidget{
  const QRCodeScanner({Key? key}) : super(key: key);

  @override
  State<QRCodeScanner> createState() => _QRCodeScannerState();
}

class _QRCodeScannerState extends State<QRCodeScanner>{
  String? _scanResults;
  MobileScannerController _scannerController  = MobileScannerController();
  RegExp regExp = RegExp(r'^\d{2}bd[15]{1}[a-z]{1}\w{4}$', caseSensitive: false, multiLine: false); // build the regular expression here..

  @override
  Widget build(BuildContext context){
    return SafeArea(
        child: Stack(
          alignment: Alignment.center,
          children: <Widget>[
            buildQRView(context),
            Positioned(
              bottom: 20,
              child: buildShowScanResult(context),
            ),
            Positioned(
              top: 20,
              child: buildShowControlButtons(context),
            ),
            Positioned(
              top: MediaQuery.of(context).size.height * 0.30,
              width: MediaQuery.of(context).size.width * 0.75,
              height: MediaQuery.of(context).size.width * 0.75,
              child: buildScanFocusArea(context),
            )
          ],
        )
    );
  }

  @override
  Widget buildQRView(BuildContext context){
    return MobileScanner(
      allowDuplicates: false,
      controller: _scannerController,
      onDetect: (barcode, args)async{
        if(barcode.rawValue == null)
          debugPrint('Failed to scan bar code');
        else{
          final String code = barcode.rawValue!;
          debugPrint("detected: "+code);
          _scanResults = code;
          if(regExp.hasMatch(_scanResults!)) {  // once a valid rollno found..
            _scannerController.stop();                  // stop scanning




            Navigator.push (
                context,
                MaterialPageRoute(
                  //builder: (context) => PermissionValidator(scannedRollNo: _scanResults!),
                  builder: (context) => PermissionFetcher(scannedRollNo: _scanResults!),
              ));

            // setup the things again..
            _scannerController.start(); // after back, resume
          }
          else{
            setState((){});             // update the state
          }
        }
      },
    );
  }
  Future getDocument() async{
    await FirebaseFirestore.instance.collection("permissions").where("RollNumber", isEqualTo: _scanResults).get()
        .then(
            (snapshot) => snapshot.docs.forEach((document) {
          print("data retrieved....");
              print(document.reference);
          print(document.data());
        })
    );
  }
  @override
  Widget buildShowScanResult(BuildContext context){
    String firstFilterStatus = " - Invalid Rollno detected";

    if (_scanResults != null) {
      debugPrint("$_scanResults - regEx check results: ${regExp.hasMatch( _scanResults!)}"); // perform regular expression check

      bool isValid = regExp.hasMatch(_scanResults!);
      if (isValid) {
        firstFilterStatus = " Valid Rollno detected";
      }
    }

    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white24,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
          _scanResults != null
              ? "Scan Result: ${_scanResults!}$firstFilterStatus"
              : "Searching for QR code...",
          maxLines: 3),
    );
  }

  void onSuccessfulRollNumFound(String str){
    print("after pause: "+str);
    Navigator.push (
        context,
        MaterialPageRoute(
          builder: (context) => PermissionValidator(scannedRollNo: _scanResults!),
    ));
  }

  // Widgetts..
  @override
  Widget buildShowControlButtons(BuildContext context){
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white24,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          IconButton(
              tooltip: 'Toggle flashlight',
              iconSize: 32,
              onPressed: () async {
                await _scannerController.toggleTorch();
                setState((){});
              },
              icon: ValueListenableBuilder(
                  valueListenable: _scannerController.torchState,
                  builder: (context, state, child) {
                    switch (state as TorchState) {
                      case TorchState.on:
                        return const Icon(Icons.flash_on, color: Colors.yellow);
                      case TorchState.off:
                        return const Icon(Icons.flash_off, color: Colors.grey);
                    }
                  }
              )
          ),
          IconButton(
            tooltip: 'Flip Camera',
            color: Colors.white,
            icon: ValueListenableBuilder(
              valueListenable: _scannerController.cameraFacingState,
              builder: (context, state, child) {
                switch (state as CameraFacing) {
                  case CameraFacing.front:
                    return const Icon(Icons.camera_front);
                  case CameraFacing.back:
                    return const Icon(Icons.camera_rear);
                }
              },
            ),
            iconSize: 32.0,
            onPressed: () async {
              await _scannerController.switchCamera();
              setState((){});
            },
          )
        ],
      ),
    );
  }

  @override
  Widget buildScanFocusArea(BuildContext context){
    return DottedBorder(
        color: Color(0xFFBDBDBD),
        //strokeCap: StrokeCap.round,
        borderType: BorderType.RRect,
        strokeWidth: 2,
        dashPattern: const [10, 10],
        radius: Radius.circular(20),
        child: ClipRRect(
          borderRadius: BorderRadius.all(Radius.circular(20)),
          child: Container(
            color: Colors.white10,
          ),
        )
    );
  }
}