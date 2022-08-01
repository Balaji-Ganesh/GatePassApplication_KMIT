import 'package:shared_preferences/shared_preferences.dart';

class Constants{                            // Single-ton class -- doesn't needed any instances
  static late SharedPreferences sharedPrefs;// = SharedPreferences.getInstance();           // (Late)Initialization is done in main.dart.
}