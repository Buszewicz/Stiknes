import 'package:flutter/material.dart';

class ThemeProvider extends InheritedWidget {
  final ThemeData themeData;
  final void Function() toggleTheme;

  const ThemeProvider({
    Key? key,
    required this.themeData,
    required this.toggleTheme,
    required Widget child,
  }) : super(key: key, child: child);

  static ThemeProvider of(BuildContext context) {
    final ThemeProvider? result = context.dependOnInheritedWidgetOfExactType<ThemeProvider>();
    assert(result != null, 'No ThemeProvider found in context');
    return result!;
  }

  @override
  bool updateShouldNotify(ThemeProvider oldWidget) {
    return oldWidget.themeData != themeData;
  }
}
