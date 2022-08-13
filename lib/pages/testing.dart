// library imports
import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

// local imports

class Testing extends StatefulWidget {
  const Testing({Key? key}) : super(key: key);

  @override
  State<Testing> createState() => _TestingState();
}

class _TestingState extends State<Testing> {
  // final CollectionReference permissionsRef = FirebaseFirestore.instance.collection("permissions");
  final Stream<QuerySnapshot> datastream = FirebaseFirestore.instance.collection("permissions").snapshots();

  void initState(){
    super.initState();
    getUsersList();
  }
  List permissionsList = [];

  Future getUsersList() async {
    List permissionsList = [];
    print("Fetching..");

    try {
     /* await permissionsRef.get().then((querySnapshot) {
        print("Received: ");
        print(querySnapshot);
        querySnapshot.docs.forEach((element) {
          permissionsList.add(element.data);
        });
      });
      permissionsList.forEach((element) {
        print("found "+element);
      });*/

      return permissionsList;
    } catch (e) {
      print("[ERROR] "+e.toString());
      return null;
    }
  }

  String displayString = "";

  fetchPermissions() async {
    dynamic result = await getUsersList();
    if (result == null)
      displayString = "Nothing to display";
    else
      setState(() {
        permissionsList = result;
        displayString += permissionsList[0]['Name'];
      });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
            child: Center(
              child: Text("Hello in testing"),
              /*child: StreamBuilder<QuerySnapshot>(
                stream: datastream,
                builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot){
                    if(snapshot.hasError){
                      // TODO: Build snack bar..
                      return Center(child: Text("Error in fetching data"));
                    }
                    if(snapshot.connectionState == ConnectionState.waiting){
                      return Center(child: CircularProgressIndicator());
                    }
                    if(snapshot.hasData){
                    final data = [];
                    snapshot.data!.docs.map((DocumentSnapshot documentSnapshot){
                      Map mapData = documentSnapshot.data() as Map<String, dynamic>;
                      print(mapData);
                      data.add(mapData);
                      //mapData['']
                    }).toList();

                    return Column(
                      children: List.generate(
                        data.length,
                          (idx) => Column(
                            children: [
                              Text(data[idx]['Name']),
                              Text(data[idx][Type]),
                            ],
                          )
                      ),
                    );}
                    return Center(child: Text("No data found"),);
                },
              )*/
              ),
        )
        );
        //);
  }

}