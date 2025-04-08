import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Startapp = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          {/* Logo circle background */}
        </View>
        <Text style={styles.logoText}>GYMTECH</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signupButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.signupText}>SIGNUP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  signupButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: '#007AFF',
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  signupText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Startapp;