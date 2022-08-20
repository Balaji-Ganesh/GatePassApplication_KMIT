import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:rakshak/model/permission.dart';
import 'package:rakshak/utils/middleware.dart';
import 'package:flutter/material.dart';

class PermissionValidator extends StatefulWidget {
  String scannedRollNo;
  PermissionValidator({Key? key, required this.scannedRollNo}) : super(key: key);

  @override
  _PermissionValidatorState createState() => _PermissionValidatorState();
}

enum Status{PENDING, ERROR, FETCH_SUCCESS}

class _PermissionValidatorState extends State<PermissionValidator> {
  bool permissionStatus = false, foundPermission = false;
  var dataRetrievalStatus = Status.PENDING;
  //Permission fetchedPermission = Permission();
  String studentName="", studentPicture="";
  int type=-1, year=1;
  bool? nextUseStatus;
  DateTime? scannedAt;

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  // testing..

  CollectionReference permissions = FirebaseFirestore.instance.collection('permissions');
  Future<void>fetchData()async{
    QuerySnapshot obj = await permissions
        .where("RollNumber",isEqualTo: widget.scannedRollNo)  // get the data of the passed rollno.
        .get();
    String studentImgPath = 'images/${widget.scannedRollNo}';
    String templateImgUrl = "https://firebasestorage.googleapis.com/v0/b/gatepass-b7114.appspot.com/o/images%2Fno_name.png?alt=media&token=9133eee3-020f-40c6-9d99-a3c521b235d0";
    String? downloadUrl;

    print("In function body");

    //  print(obj.docs.length);
    if(obj.docs.length > 0){
      studentName = obj.docs.first["StudentName"] ?? "NAME"; //fetchedPermission.StudentName = obj.docs.first["StudentName"] ?? "NAME";
      type = obj.docs.first["Type"]; //fetchedPermission.Type = obj.docs.first["Type"];
      nextUseStatus = obj.docs.first["nextUseStatus"];
      print("[INFO] time scanned "+obj.docs.first["scannedAt"].toString());
      Timestamp timestamp = obj.docs.first["scannedAt"];
      scannedAt = DateTime.parse(timestamp.toDate().toString());

      // Get the image of the respective student.. if not available, take template image.
      try{
        studentPicture = await FirebaseStorage.instance.ref().child(studentImgPath).getDownloadURL();  // No exception, if found
      }on FirebaseException catch (exception){
        print("[INFO] No image found with the student rollno.");
        studentPicture = templateImgUrl; // Will get exception, if no such photo with given name found. Then take template image.
      }catch (error){
        print("[ERROR] An error occured: "+error.toString());
      }

      // update the retrieval status.
      dataRetrievalStatus = Status.FETCH_SUCCESS;
    }
    else{
      print("Unable to get the data");
      dataRetrievalStatus = Status.ERROR;
      studentPicture = templateImgUrl;//fetchedPermission.studentPicture = templateImgUrl;
    }
    print("[STATUS]"+dataRetrievalStatus.toString());
    setState(() {});

    // call for updation..
    updatePermission(obj);
  }

  Future<void> updatePermission(QuerySnapshot snapshot)async{
    //DocumentSnapshot documentSnapshot = permissions.where("RollNumber",isEqualTo: widget.scannedRollNo).get() as DocumentSnapshot<Object?>;

   print("[INFO] Received Id for updation "+snapshot.docs.first.id);
    // Updates the permission of the student after scan.
    // STEP-1: Determine the permission type
    if(type == 1) { // if gate pass
      //await permissions.where("RollNumber",isEqualTo: widget.scannedRollNo)  // get the data of the passed rollno.
      await permissions.doc(snapshot.docs.first.id).update({"Type": -1});
      print("about to update the gate pass permission");
    }
    // STEP-2: If gatepass, change Type from 1 to -1. (i.e., simply negate it)
    else if (type == 0) { // if lunch pass..
      // if scanning for the first time (i.e., before going out) .. make it false..
      if(snapshot.docs.first["nextUseStatus"] == true) { // if its valid..
        await permissions.doc(snapshot.docs.first.id).update({
          "scannedAt":DateTime.now(),
          "nextUseStatus": false
        }); // update the value..
      }
      // if scanning second time.. (i.e., after lunch, coming back to college) -- make it true (for next day usage)
      else if(snapshot.docs.first["nextUseStatus"] == false && scannedAt?.difference(DateTime.now()).inDays == 0) // came after lunch - (using it properly))
        permissions.doc(snapshot.docs.first.id).update({"nextUseStatus": true}); // update the value..
    }
  }
  // testing code ends here..

  @override
  Widget build(BuildContext context){
    debugPrint("At building the widget: "+dataRetrievalStatus.toString());
    return Scaffold(
      body: Center(
        child: dataRetrievalStatus == Status.PENDING
            ? CircularProgressIndicator()
            : dataRetrievalStatus == Status.FETCH_SUCCESS
              ? buildPermissionCard(true, widget.scannedRollNo)
              : buildPermissionCard(false, "rollnum" ) // with dummy permission
      ),
    );
  }

  // currently, this method is of no use
  /*
  Widget builderWithFB(BuildContext context) {
    return Scaffold(
    //     appBar: AppBar(title: Text("Firebase Rakshak tests")),
    //    body: Center(
    //return Center(
        body: FutureBuilder<QuerySnapshot<Map<String, dynamic>>>(
            future: Permissions().getPermissionProfile(widget.scannedRollNo),
          //future: FirebaseFirestore.instance.collection("permissions").where("RollNumber", isEqualTo: widget.scannedRollNo).get(),
            builder: ( context , snapshot) {
              //print("received data: "+snapshot.data);
              if (snapshot.hasError) {
                return Center(
                  child: Text(
                      "Error occurred in fetching the data.\nError: ${snapshot
                          .error}"),
                );
              } else if (snapshot.hasData) {
                final permissions = snapshot.data?.docs; // get the data..
                //final DocumentSnapshot documentSnapshot = snapshot.data?.docs[0]; // get only the first one..
                //debugPrint( "Received data in builder: ${documentSnapshot['RollNumber'].toString()})
                //print(documentSnapshot['RollNumber'].toString());
                if (permissions != null && permissions.isNotEmpty) {
                  Permission permission = Permission.fromJson(permissions[0].data());
                  return Center(child: Text("year ${permission.Year}"),);
                }
                else{
                  return Center(child: Text("else"),);
                }
              }
              return const Center(child: CircularProgressIndicator());
            }));//);
  }*/
  // testing..

  //Widget buildPermissionCard(Permission permission, bool hasData, String rollNo) {
  Widget buildPermissionCard(bool hasData, String rollNo) {
    //debugPrint("At building the UI: $permission");
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
              padding: const EdgeInsets.all(20.0),
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
                      ? buildProfileAndDecisionViews(context) // ? buildProfileAndDecisionViews(context, permission)
                      : buildStudentNotFound(context, widget.scannedRollNo), // : buildStudentNotFound(context, rollNo),

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

  //Widget buildProfileAndDecisionViews(BuildContext context, Permission permission) {
  Widget buildProfileAndDecisionViews(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          //buildProfileViewer(context, permission),
          buildProfileViewer(context), // buildProfileViewer(context, permission),
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
          //buildPermissionDecision(context, permission)
          buildPermissionDecision(context)
        ],
      ),
    );
  }

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

  //Widget buildProfileViewer(BuildContext context, Permission permission) {
  Widget buildProfileViewer(BuildContext context) {
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
                  image: NetworkImage(studentPicture),
                  fit: BoxFit.cover)),
        ),
        SizedBox(
          height: 10,
        ),
        Text(
          //permission.RollNumber!.toUpperCase(), // permission.RollNumber!.toUpperCase(),
          widget.scannedRollNo.toUpperCase(),
          style: const TextStyle(
              fontSize: 22, fontWeight: FontWeight.bold, color: Colors.blue),
        ),
        Text(
          studentName,// permission.StudentName!,
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        //Text(studyYears[permission.Year!].toString() + " year"),
        Text(studyYears[year].toString() + " year"),
      ],
    );
  }

  //Widget buildPermissionDecision(BuildContext context, Permission permission) {
  Widget buildPermissionDecision(BuildContext context) {
    String passType = "", permissionBadge = "", decisionText = "";
    switch (type) {// switch (permission.Type) {
      case 0:
        print("[INFO] Lunch pass");
        // control comes here: When student with the lunch pass uses
        //   1. came before lunch -- if valid allow..
        //   2. came after lunch - (using it properly)
        if( nextUseStatus == true         // if field is valid.. allow
          || (nextUseStatus == false && scannedAt?.difference(DateTime.now()).inDays == 0) // came after lunch - (using it properly)
        ) { // if either field not exists (due to no insertion at issue time) or that field is valid.. allow
          passType = "Lunch Pass";
          decisionText = "ALLOW";
          permissionBadge =
          "https://cdn-icons-png.flaticon.com/512/6785/6785304.png";
          //Timestamp.
        }
        // control comes here: When the student with lunch pass
        //  1. hasn't used it properly (didn't came after lunch)
        else{
          // for misuse.. previous scanned date and current scanned date won't be same
          if(scannedAt?.difference(DateTime.now()).inDays != 0) {
            passType = "MIS-USED Lunch pass";
            decisionText = "DENY";
            permissionBadge = "https://cdn-icons-png.flaticon.com/512/5978/5978441.png";
          }
        }
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

        const SizedBox(
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
              const Text(
                "Scan Report",
                style: TextStyle(fontSize: 20),
              ),
              const SizedBox(
                height: 20,
              ),
              const Divider(
                height: 10,
                thickness: 10,
              ),
              const SizedBox(
                height: 40,
              ),
              Text("Name: ${permission.StudentName!}"),
            ],
          ),
        ),
      ),
    );
  }
}
