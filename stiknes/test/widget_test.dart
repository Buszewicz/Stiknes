import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:stiknes/screens/login_screen.dart';
import 'package:stiknes/screens/dashboard_screen.dart';
import 'package:stiknes/screens/settings_screen.dart';

void main() {
  group('LoginScreen Widget Tests', () {
    testWidgets('should display email and password fields', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: LoginScreen()));

      expect(find.byKey(const Key('emailField')), findsOneWidget);
      expect(find.byKey(const Key('passwordField')), findsOneWidget);
      expect(find.text('Login'), findsOneWidget);
    });

    testWidgets('should show validation errors for empty fields', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: LoginScreen()));

      await tester.tap(find.text('Login'));
      await tester.pump();

      expect(find.text('Please enter your email'), findsOneWidget);
      expect(find.text('Please enter your password'), findsOneWidget);
    });

    testWidgets('should navigate to register screen', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: LoginScreen()));

      await tester.tap(find.text('Create an account'));
      await tester.pumpAndSettle();

      expect(find.text('Register'), findsOneWidget);
    });
  });

  group('DashboardScreen Widget Tests', () {
    testWidgets('should show loading indicator initially', (tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: DashboardScreen(userId: 1),
      ));

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('should display FAB for adding notes', (tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: DashboardScreen(userId: 1),
      ));

      expect(find.byType(FloatingActionButton), findsOneWidget);
    });
  });

  group('SettingsScreen Widget Tests', () {
    testWidgets('should toggle dark mode switch', (tester) async {
      SharedPreferences.setMockInitialValues({'darkMode': false});
      
      await tester.pumpWidget(const MaterialApp(
        home: SettingsScreen(),
      ));

      final switchFinder = find.byType(Switch);
      expect(switchFinder, findsOneWidget);

      await tester.tap(switchFinder);
      await tester.pump();

      final switchWidget = tester.widget<Switch>(switchFinder);
      expect(switchWidget.value, isTrue);
    });

    testWidgets('should show change password option', (tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: SettingsScreen(),
      ));

      expect(find.text('Change Password'), findsOneWidget);
    });
  });

  group('Navigation Tests', () {
    testWidgets('should navigate from login to dashboard', (tester) async {
      // This would require mocking the Supabase client
      // For simplicity, we're just testing the navigation structure
      await tester.pumpWidget(MaterialApp(
        home: const LoginScreen(),
        routes: {
          '/dashboard': (context) => const DashboardScreen(userId: 1),
        },
      ));

      // Simulate successful login navigation
      await tester.tap(find.text('Login'));
      await tester.pumpAndSettle();

      expect(find.byType(DashboardScreen), findsOneWidget);
    });
 });
}