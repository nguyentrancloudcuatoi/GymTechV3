import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function VideoDisplayScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const videoUri = route.params?.videoUri || null;
  const [status, setStatus] = useState({});

  useEffect(() => {
    if (!videoUri) {
      Alert.alert("Error", "No video recorded", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    }
  }, [videoUri]);

  if (!videoUri) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.processingText}>Loading video...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: videoUri }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
          shouldPlay
        />
      </View>

      <View style={styles.notificationContainer}>
        <Text style={styles.notificationText}>
          Review your recording
        </Text>
        <Text style={styles.subText}>
          Make sure your form is clearly visible
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.returnButton]}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Return to Camera</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    aspectRatio: 16/9,
  },
  notificationContainer: {
    padding: 20,
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subText: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 130,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  submitButton: {
    backgroundColor: '#2ecc71',
  },
  discardButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: '#888',
  },
  // Add new button style
  returnButton: {
    backgroundColor: '#3498db',
    minWidth: 200, // Make the button wider
  }
});