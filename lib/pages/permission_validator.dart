import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:rakshak/model/permission.dart';
import 'package:rakshak/utils/middleware.dart';
import 'package:flutter/material.dart';

class PermissionValidator extends StatefulWidget {
  String scannedRollNo;
  PermissionValidator({Key? key, required this.scannedRollNo}) : super(key: key);

  @override
  _PermissionValidatorState createState() => _PermissionValidatorState();
}

class _PermissionValidatorState extends State<PermissionValidator> {
  //TextEditingController _textEditingController = TextEditingController();

  bool permissionStatus = false, foundPermission = false;
  var studentName;
  var permissionProfile;
  String displayString = "hello";
  String rollNo = "21bd5a050a";

  @override
  void initState() {
    super.initState();/**/
  }

  @override
  Widget build(BuildContext context) {

    //return Scaffold(
    //     appBar: AppBar(title: Text("Firebase Rakshak tests")),
    //    body: Center(
    return Center(
        child: FutureBuilder<QuerySnapshot<Map<String, dynamic>>>(
            future: Permissions().getPermissionProfile(widget.scannedRollNo),
            builder: (_, snapshot) {
              if (snapshot.hasError) {
                return Center(
                  child: Text(
                      "Error occured in fetching the data.\nError: ${snapshot
                          .error}"),
                );
              } else if (snapshot.hasData) {
                final permissions = snapshot.data!.docs; // get the data..
                debugPrint(
                    "Received data in builder: " + permissions.toString());
                if (permissions.isNotEmpty) {
                  if (permissions.length == 1) {
                    return buildPermissionCard(
                        Permission.fromJson(permissions[0].data()), true, widget.scannedRollNo.toUpperCase());
                  }
                } else {
                  // if empty
                  return buildPermissionCard(
                      Permission(), false, widget.scannedRollNo.toUpperCase()); // empty permission object
                }
              }
              return const Center(child: CircularProgressIndicator());
            }));//);
  }

  @override
  Widget buildPermissionCard(Permission permission, bool hasData, String rollNo) {
    debugPrint("At building the UI: " + permission.toString());
    return Container(
      color: Colors.orange[100],
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Material(
            color: Colors.grey[200],
            elevation: 7.0,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              height: hasData ? 595 : 430,
              //height: 600,
              padding: EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  const Center(
                    child: Text(
                      "Scan Report",
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(
                    height: 12,
                  ),
                  const Divider(
                    height: 5,
                    thickness: 1,
                    color: Colors.black26,
                  ),
                  const SizedBox(height: 12),
                  // for profile.. and decisions..
                  hasData
                      ? buildProfileAndDecisionViews(context, permission)
                      : buildStudentNotFound(context, rollNo),

                  const SizedBox(height: 10),
                  // a button - that closes this widget
                  Center(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        primary: Colors.blue[100],
                        minimumSize: const Size.fromHeight(35), // NEW
                      ),
                      onPressed: () {
                        Navigator.of(context).pop('done');
                      },
                      child: const Text(
                        'OK',
                        style: TextStyle(
                            fontSize: 18,
                            color: Colors.black54,
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
        //)
      ),
    );
  }

  @override
  Widget buildProfileAndDecisionViews(
      BuildContext context, Permission permission) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          buildProfileViewer(context, permission),
          const SizedBox(
            height: 10,
          ),
          Container(
            width: 200,
            height: 0.5,
            color: Colors.grey,
          ),
          const SizedBox(
            height: 5,
          ),
          buildPermissionDecision(context, permission)
        ],
      ),
    );
  }

  @override
  Widget buildStudentNotFound(BuildContext context, String rollNo){
    String notFoundImageUrl = "https://cdn-icons-png.flaticon.com/512/755/755014.png";
    return Center(
      child: Column(
        children: [
          SizedBox(height: 15,),
          Text(
            rollNo,
            style: const TextStyle(
                fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black54),
          ),
          SizedBox(height: 20,),
          Container(
            height: 150,
            width: 150,
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                image: DecorationImage(
                    image: NetworkImage(notFoundImageUrl), fit: BoxFit.cover)),
          ),
          SizedBox(height: 20,),
          const Text(
            "NOT FOUND",
            style: TextStyle(
                fontSize: 20, fontWeight: FontWeight.bold, color: Colors.redAccent),
          ),
        ],
      ),
    );
  }

  @override
  Widget buildProfileViewer(BuildContext context, Permission permission) {
    var studyYears = {1: "I", 2: "II", 3: "III", 4: "IV"};
    return Column(
      children: [
        SizedBox(
          height: 5,
        ),
        Container(
          height: 150,
          width: 130,
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              image: DecorationImage(
                  image: NetworkImage(permission.studentPicture!),
                  fit: BoxFit.cover)),
        ),
        SizedBox(
          height: 10,
        ),
        Text(
          permission.rollNo!.toUpperCase(),
          style: const TextStyle(
              fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blue),
        ),
        Text(
          permission.name!,
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        Text(studyYears[permission.year!].toString() +
            " year CSE " +
            permission.section!),
      ],
    );
  }

  @override
  Widget buildPermissionDecision(BuildContext context, Permission permission) {
    String passType = "", permissionBadge = "", decisionText = "";
    switch (permission.permissionStatus) {
      case 0:
        passType = "Lunch Pass";
        decisionText = "ALLOW";
        permissionBadge =
        "https://cdn-icons-png.flaticon.com/512/6785/6785304.png";
        break;
      case 1:
        passType = "Gate Pass";
        decisionText = "ALLOW";
        permissionBadge =
        "https://cdn-icons-png.flaticon.com/512/6785/6785304.png";
        break;
      default:
        passType = "Pass Expired";
        decisionText = "DENY";
        permissionBadge =
        "https://cdn-icons-png.flaticon.com/512/5978/5978441.png";
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[

        SizedBox(
          height: 30,
        ),
        Container(
          height: 120,
          width: 120,
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              image: DecorationImage(
                  image: NetworkImage(permissionBadge), fit: BoxFit.cover)),
        ),
        Text(
          decisionText,
          style: TextStyle(
              fontSize: 30,
              fontWeight: FontWeight.w900,
              color: decisionText == "ALLOW" ? Colors.green : Colors.redAccent),
        ),
        Text(
          passType,
        ),
      ],
    );
  }

  @override
  Widget buildPermissionCardInProgress(Permission permission) {
    debugPrint("At building the UI: " + permission.toString());
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Text("Name: " + permission.rollNo!),
        Text("Name: " + permission.name!),
      ],
    );
  }

  // Text("Name: "+permission.rollNo!),
  @override
  Widget buildPermissionDisplayer(Permission permission) {
    debugPrint("At building the UI: " + permission.toString());
    return Center(
      child: Material(
        elevation: 7.0,
        borderRadius: BorderRadius.circular(7.0),
        child: Container(
          height: 400,
          padding: EdgeInsets.all(10.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                "Scan Report",
                style: TextStyle(fontSize: 20),
              ),
              SizedBox(
                height: 20,
              ),
              Divider(
                height: 10,
                thickness: 10,
              ),
              SizedBox(
                height: 40,
              ),
              Text("Name: " + permission.name!),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget buildPermissionDisplayers(Permission permission) {
    debugPrint("At building the UI: " + permission.toString());
    return ListTile(
      leading: CircleAvatar(
        child: Image.network(permission.studentPicture!),
      ),
      title: Text(permission.name!),
      subtitle: Text(permission.rollNo!),
    );
  }
/*
  @override
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
  }
  */
}
