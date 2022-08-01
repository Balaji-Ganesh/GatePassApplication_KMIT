import 'package:flutter/material.dart';

class History extends StatefulWidget{
  const History({Key? key}) : super(key: key);

  @override
  State<History> createState() => _HistoryState();
}

class _HistoryState extends State<History>{
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const <Widget>[
          Text("----- History -----"),
          Text("Shows list of students who got"),
          Text("scanned along with their scan results"),
          Text("Development in progress."),
          Text("Version with this feature to be released soon.")
        ],
      )
    );
  }
}