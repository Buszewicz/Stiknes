import 'package:flutter/material.dart';
import 'edit_note_screen.dart';
import 'settings_screen.dart';
import 'user_info_screen.dart';
import 'login_screen.dart';

class DashboardScreen extends StatelessWidget {
  final String username;

  DashboardScreen({super.key, required this.username});

  final List<Map<String, String>> notes = List.generate(
    5,
    (index) => {
      'title': 'Note ${index + 1}',
      'content': 'Content of note ${index + 1}. You can edit this note.',
    },
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView.builder(
          itemCount: notes.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(notes[index]['title']!),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => EditNoteScreen(note: notes[index]),
                  ),
                );
              },
            );
          },
        ),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              decoration: const BoxDecoration(color: Colors.blue),
              child: Text(
                'Welcome, $username',
                style: const TextStyle(color: Colors.white, fontSize: 20),
              ),
            ),
            ListTile(
              title: const Text('Settings'),
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => const SettingsScreen()));
              },
            ),
            ListTile(
              title: const Text('User Info'),
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => UserInfoScreen(username: username)));
              },
            ),
            ListTile(
              title: const Text('Log Out'),
              onTap: () {
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => const LoginScreen()));
              },
            ),
          ],
        ),
      ),
    );
  }
}
