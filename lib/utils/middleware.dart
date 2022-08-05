import 'package:cloud_firestore/cloud_firestore.dart';

import '../model/permission.dart';

class Permissions {
  Future<QuerySnapshot<Map<String, dynamic>>> getPermissionProfile(String rollNo) async {
    print("Received roll no: $rollNo");
    Permission requestedPermission = Permission();
    return await FirebaseFirestore.instance
            .collection("permissions")
            //.where("RollNumber", isEqualTo: rollNo)
            .get();
     //       .then((permissions){
     //         var doc = Permission.fromJson(permissions.docs?[0].data());
    //});
    //.get();  // this gives future , .snapshots() ; // this gives stream
    /*.then((permissions) {
      for (var permission in permissions.docs) {
        print("${permission.data()}"); // iterate this wat
      }
    });

    return "Where are you?";*/
  }
}
