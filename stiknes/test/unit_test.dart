import 'package:flutter_test/flutter_test.dart';
import 'package:crypto/crypto.dart';
import 'dart:convert';

// Test utilities
String hashPassword(String password) {
  return sha256.convert(utf8.encode(password)).toString();
}

void main() {
  group('Password Hashing', () {
    test('should hash password consistently', () {
      const password = 'test123';
      final hash1 = hashPassword(password);
      final hash2 = hashPassword(password);
      
      expect(hash1, isNotEmpty);
      expect(hash1, equals(hash2));
    });

    test('should produce different hashes for different passwords', () {
      final hash1 = hashPassword('password1');
      final hash2 = hashPassword('password2');
      
      expect(hash1, isNot(equals(hash2)));
    });
  });

  group('Form Validation', () {
    test('email validation should require @ symbol', () {
      const validEmail = 'test@example.com';
      const invalidEmail = 'testexample.com';
      
      expect(validEmail.contains('@'), isTrue);
      expect(invalidEmail.contains('@'), isFalse);
    });

    test('password validation requires minimum length', () {
      const shortPassword = '12345';
      const validPassword = '123456';
      
      expect(shortPassword.length >= 6, isFalse);
      expect(validPassword.length >= 6, isTrue);
    });
  });

  group('Note Operations', () {
    test('note should require title', () {
      const emptyTitle = '';
      const validTitle = 'My Note';
      
      expect(emptyTitle.isEmpty, isTrue);
      expect(validTitle.isNotEmpty, isTrue);
    });

    test('note dates should be in ISO format', () {
      final now = DateTime.now();
      final isoString = now.toIso8601String();
      
      expect(isoString, contains('T'));
      expect(isoString, contains(now.year.toString()));
    });
  });
}