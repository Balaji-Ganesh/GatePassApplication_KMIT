import 'package:flutter/material.dart';

class ProfileDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: const EdgeInsets.all(0),
        children: [
          const UserAccountsDrawerHeader(
            accountName: Text("Govind"),
            accountEmail: Text("govind@kmit.com"),
            currentAccountPicture: CircleAvatar(
              backgroundImage: NetworkImage(
                  "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80"),
            ),
          ),
          ListTile(
              leading: Icon(Icons.person),
              title: Text("Govind"),
              subtitle: Text("Security gaurd"),
              trailing: Icon(Icons.edit),
              onTap: () {}),
          ListTile(
              leading: Icon(Icons.email_rounded),
              title: Text("Contact"),
              subtitle: Text("krishna@admin.com"),
              trailing: Icon(Icons.edit),
              onTap: () {}),
          ListTile(
              leading: Icon(Icons.phone),
              title: Text("Talk with admin"),
              subtitle: Text("+91 9876543210"),
              trailing: Icon(Icons.edit),
              onTap: () {}),
          ListTile(
              leading: Icon(Icons.school),
              title: const Text("College"),
              subtitle: const Text("KMIT"),
              trailing: Icon(Icons.edit),
              onTap: () {}),
        ],
      ),
    );
  }
}
