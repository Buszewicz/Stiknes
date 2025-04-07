import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/login_screen.dart';
import 'theme_notifier.dart';

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

class MyApp extends StatelessWidget {
  final bool isDarkMode;
  
  const MyApp({super.key, required this.isDarkMode});

  @override
  Widget build(BuildContext context) {
    return ThemeProvider(
      notifier: ThemeNotifier(
        isDarkMode ? ThemeNotifier.darkTheme : ThemeNotifier.lightTheme,
        isDarkMode,
      ),
      child: Builder(
        builder: (context) {
          final theme = ThemeProvider.of(context);
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