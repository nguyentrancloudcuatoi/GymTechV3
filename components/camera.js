// ./components/camera.js
import React, { useState, useRef, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, AppState, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import useRoute
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';

export default function CameraScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute(); // <-- Add useRoute hook
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUri, setRecordedVideoUri] = useState(null);
  // recordingDuration state is only needed if you plan to show a timer or enforce max duration manually again
  // const [recordingDuration, setRecordingDuration] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);
  // intervalRef only needed if using timer logic/UI
  // const intervalRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const hasRecordedVideo = !!recordedVideoUri;

  // --- Effect to handle result from VideoDisplayScreen ---
  useEffect(() => {
    // Check if the screen is focused and there's a result parameter
    if (isFocused && route.params?.result) {
      const { result, timestamp } = route.params;
      console.log(`[CameraScreen] Received result: ${result} at ${timestamp}`);

      if (result === 'save' || result === 'discard') {
        console.log(`[CameraScreen] Video was ${result}. Clearing URI.`);
        setRecordedVideoUri(null); // Clear the video URI
      }

      // Important: Clear the result params to prevent re-triggering on subsequent focus events
      navigation.setParams({ result: undefined, timestamp: undefined });
    }
  }, [isFocused, route.params?.result, route.params?.timestamp, navigation]); // Dependencies


  // Effect xử lý AppState
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if ( appState.current.match(/active|foreground/) && nextAppState === 'background' && isRecording && cameraRef.current) {
        console.log('[App State] App went to background - Stopping recording...');
         // Attempt to stop recording gracefully
         cameraRef.current.stopRecording()
          .catch(e => console.error("[App State] Error stopping recording on background:", e))
          .finally(() => setIsRecording(false)); // Ensure state is reset
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
      // Cleanup interval if using timer
      // if (intervalRef.current) {
      //   clearInterval(intervalRef.current);
      // }
    };
  }, [isRecording]); // Dependency only on isRecording

  // Effect xử lý Screen Focus/Blur
  useEffect(() => {
    if (!isFocused) {
      console.log('[Focus] Screen lost focus.');
      if (isRecording && cameraRef.current) {
         console.log('[Focus] Stopping recording due to blur.');
         // Stop recording gracefully
         cameraRef.current.stopRecording()
          .catch(e => console.error("[Focus] Error stopping recording on blur:", e))
          .finally(() => setIsRecording(false)); // Reset state
        // stopTimer(); // Stop timer if using
      }
      // **DO NOT CLEAR recordedVideoUri here** - let the result handler do it.
    } else {
       console.log('[Focus] Screen gained focus.');
       // No need to clear video URI here when gaining focus.
    }
  }, [isFocused, isRecording]); // Dependencies

  // --- Permissions --- (Keep as is)
  if (!permission) {
    return <SafeAreaView style={styles.container}><View style={styles.permissionContainer}><Text style={styles.message}>Requesting permissions...</Text></View></SafeAreaView>;
  }
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.message}>Camera and Microphone permissions are required to record video.</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      </SafeAreaView>
    );
  }

  // --- Callbacks & Logic --- (Keep handleCameraReady, handleCameraMountError)
  const handleCameraReady = () => {
    console.log('[Camera] Ready');
    setIsCameraReady(true);
  };

  const handleCameraMountError = (error) => {
    console.error("[CameraView] Mount Error:", error);
    Alert.alert("Camera Error", `Failed to initialize camera: ${error.message}. Please check permissions and try again.`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
    setIsCameraReady(false);
  };

  // --- Timer Logic (Optional - keep if needed for UI/max duration) ---
  // const startTimer = () => { ... };
  // const stopTimer = () => { ... };

  // --- Camera Actions --- (Keep toggleCameraFacing as is)
   function toggleCameraFacing() {
    if (isRecording || hasRecordedVideo || !isCameraReady) return;
    console.log('[Camera] Flipping');
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

   // --- toggleRecording (Refined Logic) ---
   async function toggleRecording() {
    if (!permission?.granted) {
      Alert.alert("Permission Error", "Camera or Microphone permission missing."); return;
    }
    if (!isCameraReady || !cameraRef.current) {
      Alert.alert("Camera Not Ready", "Please wait."); return;
    }
    // Prevent starting new recording if a video is pending review
    if (hasRecordedVideo && !isRecording) {
       Alert.alert("Video Ready", "Review the current video or discard it to record again.");
       return;
    }

    if (isRecording) {
      // Stop Recording
      console.log('[toggleRecording] Requesting Stop Recording...');
      // Optimistically update UI, but actual stop happens asynchronously
      // setIsRecording(false); // Let the finally block handle this after promise resolves/rejects
      // stopTimer(); // Stop timer if using

      try {
        // Don't necessarily need to await here, the recordAsync promise handles completion
        cameraRef.current.stopRecording();
        console.log('[toggleRecording] stopRecording() called.');
      } catch (error) {
        console.error('[toggleRecording] Error calling stopRecording:', error);
        // Maybe alert user? Resetting state happens in finally anyway.
        // Alert.alert('Error', 'Could not stop recording cleanly.');
         setIsRecording(false); // Force reset state on error
         // stopTimer();
      }
    } else {
      // Start Recording
      console.log('[toggleRecording] Starting Recording...');
      setRecordedVideoUri(null); // Clear any previous URI remnants
      setIsRecording(true);
      // startTimer(); // Start timer if using

      // Inside toggleRecording function, update the recording completion part
      try {
        const recordOptions = { maxDuration: 30, quality: '720p' };
        console.log('[toggleRecording] Calling recordAsync with options:', recordOptions);
        const data = await cameraRef.current.recordAsync(recordOptions);
        console.log('[toggleRecording] Recording FINISHED. Data:', data);
      
        if (data?.uri) {
          setRecordedVideoUri(data.uri);
          console.log('[toggleRecording] Recorded Video URI set:', data.uri);
          Alert.alert(
            "Video Recording Complete",
            "Would you like to review and submit this video?",
            [
              {
                text: "Discard",
                style: "cancel",
                onPress: () => {
                  console.log('[CameraScreen] Discarding recorded video');
                  setRecordedVideoUri(null);
                }
              },
              {
                text: "Submit",
                style: "default",
                onPress: () => {
                  console.log('[CameraScreen] Navigating to VideoDisplayScreen with URI:', data.uri);
                  // Inside toggleRecording function, update the navigation part
                  navigation.navigate('VideoDisplayScreen', {
                    videoUri: data.uri,
                    fromCamera: true
                  });
                }
              }
            ],
            { cancelable: false }
          );
        } else {
          console.warn('[toggleRecording] No URI received after recording finished.');
          setRecordedVideoUri(null);
        }
      } catch (error) {
        console.error('[toggleRecording] Recording Error:', error);
        Alert.alert('Recording Error', `Could not record video: ${error.message || 'Unknown error'}.`);
        setRecordedVideoUri(null);
      } finally {
         console.log('[toggleRecording] Recording process finished (or errored). Resetting state.');
         // IMPORTANT: Reset recording state *after* the promise completes or fails
         setIsRecording(false);
         // stopTimer(); // Stop timer if using
      }
    }
  }


  // --- Navigation ---
  const handleNavigateToDisplay = () => {
    if (!recordedVideoUri) {
      console.log('[CameraScreen] No video URI available');
      Alert.alert("Error", "No video to display.");
      return;
    }

    Alert.alert(
      "Review Video",
      "Would you like to review and submit this video?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Review & Submit",
          style: "default",
          onPress: () => {
            console.log('[CameraScreen] Navigating to VideoDisplay with URI:', recordedVideoUri);
            navigation.navigate('VideoDisplayScreen', { // Đảm bảo tên này khớp với App.js
              videoUri: recordedVideoUri,
              fromCamera: true
            });
          }
        }
      ]
    );
  };

  const handleGoBack = () => {
    if (isRecording) return; // Don't allow back while recording
    // If a video is recorded but not yet submitted/discarded, ask for confirmation
    if (hasRecordedVideo) {
      Alert.alert(
        "Discard Video?",
        "Going back now will discard the recorded video.",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Discard & Go Back",
            style: "destructive",
            onPress: () => {
              console.log('[CameraScreen] Discarding video via back button.');
              setRecordedVideoUri(null); // Clear the URI
              // setRecordingDuration(0); // Reset duration if using state
              navigation.goBack(); // Then navigate back
            }
          }
        ],
        { cancelable: true }
      );
    } else {
      // If no video is pending, just go back
      navigation.goBack();
    }
  };

  // --- UI Component --- (Keep JSX structure as is, remove timer UI if not used)
  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        mode="video"
        videoQuality={'720p'}
        microphoneEnabled={true}
        onCameraReady={handleCameraReady}
        onMountError={handleCameraMountError}
      >
        {/* Nút Back */}
        <TouchableOpacity
          style={[ styles.topButton, styles.backButton, isRecording ? styles.disabledButton : {} ]}
          onPress={handleGoBack}
          disabled={isRecording} >
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </TouchableOpacity>

        {/* Container dưới */}
        <View style={styles.bottomContainer}>
            {/* Controls */}
            <View style={styles.controlsContainer}>
              {/* Flip */}
              <TouchableOpacity
                style={[ styles.controlButton, styles.flipButton ,(!isCameraReady || isRecording || hasRecordedVideo) ? styles.disabledButton : {} ]}
                onPress={toggleCameraFacing}
                disabled={!isCameraReady || isRecording || hasRecordedVideo} >
                <Ionicons name="camera-reverse-outline" size={30} color="white" />
              </TouchableOpacity>
              {/* Record/Stop */}
              <TouchableOpacity
                style={[ styles.controlButton, styles.recordButton, isRecording ? styles.recordingActive : {}, (!isCameraReady || (hasRecordedVideo && !isRecording)) ? styles.disabledButton : {} ]}
                onPress={toggleRecording}
                // Disable if camera not ready OR if video is pending review
                disabled={!isCameraReady || (hasRecordedVideo && !isRecording)} >
                 <Ionicons name={isRecording ? "square" : "ellipse"} size={isRecording ? 28 : 35} color={isRecording ? "black" : (hasRecordedVideo ? "rgba(255,0,0,0.3)" : (isCameraReady ? "red" : "grey"))} />
              </TouchableOpacity>
              {/* View Video Button (Placeholder or Checkmark) */}
              <View style={[styles.controlButton, styles.viewButtonPlaceholder]}>
                {/* Show checkmark only when video is ready and not recording */}
                {hasRecordedVideo && !isRecording ? (
                  <TouchableOpacity style={styles.viewVideoButton} onPress={handleNavigateToDisplay} >
                    <Ionicons name="checkmark-circle" size={38} color="#2ecc71" />
                  </TouchableOpacity>
                ) : (
                  // Keep placeholder size consistent
                  <View />
                )}
              </View>
            </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

// --- Styles --- (Add specific styles for clarity if needed)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#000' },
  message: { textAlign: 'center', paddingBottom: 20, color: 'white', fontSize: 18 },
  camera: { flex: 1, position: 'relative' },
  topButton: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 30, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 22, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  backButton: { left: 15 },
  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 35 : 25, paddingTop: 10, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 5 },
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 30 }, // Use space-between
  controlButton: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 }, // Shared style for buttons
  flipButton: { // Specific style if needed, otherwise controlButton is fine
     backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  recordButton: { // Style for the center record button area
     borderWidth: 3,
     borderColor: 'transparent', // Border shown when active? Or just background change?
     backgroundColor: 'transparent', // Base transparent background
  },
  recordingActive: { // Style when recording IS active
     backgroundColor: 'white', // White background for the square/inner icon area?
     borderColor: 'rgba(0,0,0,0.1)', // Optional subtle border
     // The icon color change is handled inline
  },
   viewButtonPlaceholder: { // Placeholder on the right to maintain spacing
       backgroundColor: 'transparent', // Invisible placeholder
   },
  viewVideoButton: { // Actual checkmark button style
       justifyContent: 'center',
       alignItems: 'center',
       width: '100%',
       height: '100%',
       borderRadius: 35,
       backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
       borderWidth: 3,
       borderColor: '#2ecc71', // Green border to match icon
  },
  // placeholderView: { width: '100%', height: '100%', backgroundColor: 'transparent', borderRadius: 35 }, // Not needed if using viewButtonPlaceholder
  disabledButton: { opacity: 0.4 }, // Style for any disabled button
});

// Add this function after recording is complete
const handleRecordingFinished = (videoUri) => {
  if (!videoUri) {
    console.error('[CameraScreen] No video URI available');
    return;
  }

  Alert.alert(
    "Video Recording",
    "What would you like to do with this video?",
    [
      {
        text: "Discard",
        style: "cancel",
        onPress: () => {
          setRecordedVideoUri(null);
          // Reset any other necessary recording states
        }
      },
      {
        text: "Review & Submit",
        style: "default",
        onPress: () => {
          console.log('[CameraScreen] Navigating to VideoDisplay with URI:', videoUri);
          navigation.navigate('VideoDisplay', {
            videoUri: videoUri,
            fromCamera: true
          });
        }
      }
    ],
    { cancelable: false }
  );
};

// Update your existing recording completion handler
const onStopRecording = async () => {
  try {
    if (cameraRef.current) {
      setIsRecording(false);
      const video = await cameraRef.current.stopRecording();
      console.log('[CameraScreen] Recording stopped, video URI:', video.uri);
      setRecordedVideoUri(video.uri);
      // Show the confirmation popup
      handleRecordingFinished(video.uri);
    }
  } catch (error) {
    console.error('[CameraScreen] Error stopping recording:', error);
    Alert.alert('Error', 'Failed to save video recording.');
    setIsRecording(false);
  }
};