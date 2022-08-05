// library imports
import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

// local imports
import 'package:rakshak/model/permission.dart';

class PermissionFetcher extends StatefulWidget {
  String scannedRollNo;

  PermissionFetcher({Key? key, required this.scannedRollNo}) : super(key: key);

  @override
  State<PermissionFetcher> createState() => _PermissionFetcherState();
}

class _PermissionFetcherState extends State<PermissionFetcher> {

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getDocument();
  }

  Future getDocument() async{
    await FirebaseFirestore.instance.collection("permissions").where("RollNumber", isEqualTo: widget.scannedRollNo).get()
        .then(
            (snapshot) => snapshot.docs.forEach((document) {
          print("data retrieved....");
          print(document.reference);
          print(document.data());
        })
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Container(
      child: Center(
        child: FutureBuilder<QuerySnapshot<Map<String, dynamic>>>(
            builder: (context, snapshot) {
              if (snapshot.hasError)
                return Text("Error occured! ${snapshot.error}");
              else if (snapshot.hasData) {
                return Container();
              } else {
                return Center(
                  child: CircularProgressIndicator(),
                );
              }
            }),
      ),
    ));
  }



/*Stream<List<Stream>> getPermissions()=> FirebaseFirestore.instance
      .collection('permissions').snapshots()
      .map((snapshot)=>snapshot.docs
      .map((doc)=>Permission.fromJson(doc.data())));
* /
  Widget useThisToShowMultipleStudents(BuildContext context, Permission permissions){
    return ListView.builder(
        itemCount: permissions.length,
        itemBuilder: (_, idx) {
          final permission = Permission.fromJson(
              permissions[idx]
                  .data()); //cvt JSON -> dart object
          debugPrint(
              "Received data: " + permission.toString());
          return permission == null
              ? Center(
            child: Text("Error in user fields"),
          )
              : buildPermissionDisplayer(permission);
        }
      //children: users!.map(buildUserDisplay).toList(),
    );
  }*/
}
