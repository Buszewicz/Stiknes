import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/login_screen.dart';

Future<void> main() async {
  await Supabase.initialize(
    url: 'https://arpxrljtyjqsvdeiylts.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycHhybGp0eWpxc3ZkZWl5bHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4ODYyOTgsImV4cCI6MjA1NTQ2MjI5OH0.14oKr6hHY_7y7wrokdEGGkzQkKVAjZvXv8SQwBAwqcU',
  );

  runApp(MyApp());
}

final supabase = Supabase.instance.client;
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Stiknes',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const LoginScreen(),
    );
  }
}
