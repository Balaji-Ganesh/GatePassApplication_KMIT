import 'package:cloud_firestore/cloud_firestore.dart';

class Permissions {
  Future<QuerySnapshot<Map<String, dynamic>>> getPermissionProfile(
      String rollNo) async {
    print("Received roll no: " + rollNo);
    return await FirebaseFirestore.instance
        .collection("permissions")
        .where("rollNo", isEqualTo: rollNo)
        .get();
    //.get();  // this gives futrue , .snapshots() ; // this gives stream
    /*.then((permissions) {
      for (var permission in permissions.docs) {
        print("${permission.data()}"); // iterate this wat
      }
    });

    return "Where are you?";*/
  }
}
