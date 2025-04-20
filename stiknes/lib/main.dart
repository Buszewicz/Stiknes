import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/login_screen.dart';
import 'theme_notifier.dart'; // <-- dodaj

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load();
  await Supabase.initialize(
    url: dotenv.env['SUPABASE_URL']!,
    anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
  );

  final prefs = await SharedPreferences.getInstance();
  final isDarkMode = prefs.getBool('darkMode') ?? false;

  runApp(MyApp(isDarkMode: isDarkMode));
}

final supabase = Supabase.instance.client;

class MyApp extends StatefulWidget {
  final bool isDarkMode;
  const MyApp({super.key, required this.isDarkMode});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late ThemeData _themeData;

  @override
  void initState() {
    super.initState();
    _themeData = widget.isDarkMode ? ThemeData.dark() : ThemeData.light();
  }

  void _toggleTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isCurrentlyDark = _themeData.brightness == Brightness.dark;
    final newTheme = isCurrentlyDark ? ThemeData.light() : ThemeData.dark();
    await prefs.setBool('darkMode', !isCurrentlyDark);

    setState(() {
      _themeData = newTheme;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ThemeProvider(
      themeData: _themeData,
      toggleTheme: _toggleTheme,
      child: Builder(
        builder: (context) {
          final theme = ThemeProvider.of(context).themeData;
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Stiknes',
            theme: theme,
            home: const LoginScreen(),
          );
        },
      ),
    );
  }
}
