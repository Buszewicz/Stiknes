import 'package:flutter/material.dart';

class ThemeNotifier with ChangeNotifier {
  ThemeData _themeData;
  bool _isDarkMode;

  ThemeNotifier(this._themeData, this._isDarkMode);

  ThemeData getTheme() => _themeData;
  bool isDarkMode() => _isDarkMode;

  static ThemeData get lightTheme => _lightTheme;
  static ThemeData get darkTheme => _darkTheme;

  void setTheme(ThemeData themeData, bool isDarkMode) {
    _themeData = themeData;
    _isDarkMode = isDarkMode;
    notifyListeners();
  }

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    _themeData = _isDarkMode ? darkTheme : lightTheme;
    notifyListeners();
  }

  static ThemeNotifier? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<ThemeProvider>()?.notifier;
  }

  static final ThemeData _lightTheme = ThemeData(
    brightness: Brightness.light,
    primarySwatch: Colors.blue,
    cardColor: Colors.white,
    scaffoldBackgroundColor: Colors.grey[100],
    appBarTheme: const AppBarTheme(
      color: Colors.blue,
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: Colors.blue,
    ),
    dividerColor: Colors.grey[300],
  );

  static final ThemeData _darkTheme = ThemeData(
    brightness: Brightness.dark,
    primarySwatch: Colors.blueGrey,
    cardColor: Colors.grey[900],
    scaffoldBackgroundColor: Colors.grey[850],
    appBarTheme: AppBarTheme(
      color: Colors.grey[900],
      titleTextStyle: const TextStyle(
        color: Colors.white,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: Colors.blueGrey[700],
    ),
    dividerColor: Colors.grey[700],
  );
}

class ThemeProvider extends InheritedNotifier<ThemeNotifier> {
  const ThemeProvider({
    Key? key,
    required ThemeNotifier notifier,
    required Widget child,
  }) : super(key: key, notifier: notifier, child: child);

  static ThemeData of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<ThemeProvider>()!.notifier!.getTheme();
  }
}