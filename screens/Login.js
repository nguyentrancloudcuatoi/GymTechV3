import React, { useState, useRef } from 'react'; // <--- Import useRef
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef(null); // <--- Initialize ref

  const handleLogin = () => {
    // Trim inputs for validation
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    // For demo purposes, using hardcoded credentials
    const validEmail = 'test@gmail.com';
    const validPassword = '123456';

    // Compare trimmed and potentially case-insensitive email
    if (trimmedEmail.toLowerCase() === validEmail && trimmedPassword === validPassword) {
      console.log('Login successful!');
      // --- CẬP NHẬT QUAN TRỌNG Ở ĐÂY ---
      // Reset the navigation stack to HomeScreen, removing Login from history
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }], // Set HomeScreen as the only screen in the stack
      });
      // ---------------------------------
    } else {
      Alert.alert('Error', 'Invalid email or password.');
    }
  };

  const navigateToSignup = () => {
    // Ensure 'Signup' is defined in your navigator
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    Alert.alert('Notice', 'Forgot password feature is under development.');
  };

  // --- JSX Phần còn lại giữ nguyên ---
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
          onPress={() => navigation.goBack()} // Nút này vẫn hữu ích nếu người dùng từ Signup quay lại Login
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>LOGIN</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            blurOnSubmit={false}
          />

          <Text style={styles.label}>Password:</Text>
          <TextInput
            ref={passwordInputRef}
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin} // Trigger login on "Done"
          />

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.signInText}>SIGN IN</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />
    </KeyboardAvoidingView>
  );
}

// --- Stylesheet giữ nguyên ---
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
    marginBottom: 40,
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
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#007AFF',
    marginBottom: 25,
    fontSize: 14,
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
});