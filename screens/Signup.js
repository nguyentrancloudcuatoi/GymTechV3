import React, { useState, useRef } from 'react'; // Import useRef
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView, // Import KeyboardAvoidingView
  Platform,
  ScrollView,
  StatusBar, // Import StatusBar
  ActivityIndicator // Import ActivityIndicator for loading state
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Basic email validation regex (can be more complex)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  // Refs for input focus chaining
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const handleSignup = () => {
    // Trim inputs before validation
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFullName || !trimmedEmail || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
        Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ.');
        return;
    }

    // Example: Basic password length check
    if (password.length < 6) {
        Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
        return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    // --- Simulate API Call ---
    setIsLoading(true); // Show loading indicator
    console.log('Đang đăng ký với:', { fullName: trimmedFullName, email: trimmedEmail, password });

    // Simulate network request delay
    setTimeout(() => {
      setIsLoading(false); // Hide loading indicator
      // In a real app, check the API response here
      Alert.alert('Thành công', 'Tài khoản đã được tạo thành công!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login') // Navigate after success
        }
      ]);
       // Clear fields after successful signup (optional)
       setFullName('');
       setEmail('');
       setPassword('');
       setConfirmPassword('');
    }, 1500); // Simulate 1.5 second delay
    // -----------------------
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      enabled
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>ĐĂNG KÝ</Text>

        <View style={styles.formContainer}>
          {/* Full Name Input */}
          <Text style={styles.label}>Họ và tên:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên của bạn"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words" // Capitalize first letter of each word
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
            blurOnSubmit={false}
          />

          {/* Email Input */}
          <Text style={styles.label}>Email:</Text>
          <TextInput
            ref={emailInputRef}
            style={styles.input}
            placeholder="Nhập email của bạn"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress" // Helps with autofill
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            blurOnSubmit={false}
          />

          {/* Password Input */}
          <Text style={styles.label}>Mật khẩu:</Text>
          <TextInput
            ref={passwordInputRef}
            style={styles.input}
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword" // Helps password managers suggest strong passwords
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            blurOnSubmit={false}
          />

          {/* Confirm Password Input */}
          <Text style={styles.label}>Xác nhận Mật khẩu:</Text>
          <TextInput
            ref={confirmPasswordInputRef}
            style={styles.input}
            placeholder="Nhập lại mật khẩu của bạn" // Improved placeholder
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            textContentType="newPassword"
            returnKeyType="done" // Last input field
            onSubmitEditing={handleSignup} // Trigger signup on "Done"
          />

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signUpButton} // Renamed style for clarity
            onPress={handleSignup}
            activeOpacity={0.8}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.signUpText}>ĐĂNG KÝ</Text>
            )}
          </TouchableOpacity>

            {/* Link to Login */}
             <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />
    </KeyboardAvoidingView>
  );
}

// Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 1,
  },
  backText: {
    fontSize: 28,
    color: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30, // Adjusted margin
    color: '#333',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15, // Consistent margin
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  signUpButton: { // Renamed style
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // Added margin top
    marginBottom: 20, // Added margin bottom
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  signUpText: { // Renamed style
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  loginContainer: { // Styles for login link
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
});