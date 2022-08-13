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
    /*getDocument();*/
    fetchData();
  }

  // testing..
   String studentName = "error";
  bool dataRetrieved = false;
  
  CollectionReference users = FirebaseFirestore.instance.collection('permissions');
  Future<void>fetchData()async{
    QuerySnapshot obj = await users
        .where("RollNumber",isEqualTo: widget.scannedRollNo)
        .get();

    //  print(obj.docs.length);
    if(obj.docs.length > 0){
      // print(obj.docs.first["StudentName"]);
      // print(rollNumber);
      studentName = obj.docs.first["StudentName"];
      //  print(studentName);
      //  print(rollNumber);
      //  print(url);
      print("Received data: "+studentName);
      dataRetrieved = true;
      setState(() {});

    }
    else{
      print("Unable to get the data");
      dataRetrieved = false;
    }

  }
  // testing code ends here..

  /*Future getDocument() async{
    await FirebaseFirestore.instance.collection("permissions").where("RollNumber", isEqualTo: widget.scannedRollNo).get()
        .then(
            (snapshot) => snapshot.docs.forEach((document) {
          print("data retrieved....");
          print(document.reference);
          print(document.data());
        })
    );
  }*/

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Container(
      child: Center(
        child: Text("Student Name: "+studentName)
        )
      ),
    );
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
