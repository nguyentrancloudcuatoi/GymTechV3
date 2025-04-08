import React, { useRef, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

const DATA = [
    { id: '1', title: 'Squat', image: require('../assets/image/squad.png'), description: 'Squats help build strength in your legs.', video: require('../assets/image/squad.mp4'), instructions: 'Stand tall, lower your body by pushing your hips back, thighs parallel to the ground, keep weight on your heels, and rise up while squeezing your glutes.' },
    { id: '2', title: 'Plank', image: require('../assets/image/plank.png'), description: 'Planks are great for core strength.', video: require('../assets/image/plank.mp4'), instructions: "Forearms on the ground, body straight, core tight, don't lift hips too high or drop them low, hold and breathe steadily." },
    { id: '3', title: 'Push ups', image: require('../assets/image/pushups.png'), description: 'Push-ups are a classic upper body exercise.', video: require('../assets/image/pushups.mp4'), instructions: 'Keep your body straight from head to heels, lower your chest to almost touch the floor and then push up.' },
];

const Item = ({ title, image, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Image source={image} style={styles.image} resizeMode="contain" />
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

// --- HomeScreen Component (giữ nguyên) ---
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Skills</Text>
      <FlatList
        style={styles.list}
        data={DATA}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            image={item.image}
            onPress={() => navigation.navigate('Detail', { item })}
          />
        )}
        keyExtractor={item => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
};

// --- DetailScreen Component (CẬP NHẬT) ---
const DetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const videoRef = useRef(null); // <<<--- Thêm Ref cho Video

  // Sử dụng useFocusEffect để kiểm soát video
  useFocusEffect(
    useCallback(() => {
      // Effect chạy khi màn hình được focus
      console.log("Detail Screen Focused - Playing video");
      // Sử dụng .playAsync() để bắt đầu phát
      // Optional chaining (?.) để tránh lỗi nếu ref chưa sẵn sàng
      videoRef.current?.playAsync();

      // Hàm cleanup chạy khi màn hình mất focus
      return () => {
        console.log("Detail Screen Blurred - Stopping video");
        // Sử dụng .stopAsync() để dừng và reset video
        videoRef.current?.stopAsync();
      };
    }, []) // Dependency array rỗng để effect chạy khi focus/blur
  );

  return (
    <View style={styles.detailContainer}>
      <Video
        ref={videoRef}
        source={item.video}
        style={styles.detailVideo}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        useNativeControls
        onError={(error) => console.error("Video Error in DetailScreen:", error)}
      />
      <Text style={styles.detailTitle}>{item.title}</Text>
      <Text style={styles.detailDescription}>{item.description}</Text>

      <View style={styles.additionalInfoContainer}>
        <Text style={styles.additionalInfoTitle}>Instructions:</Text>
        <Text style={styles.additionalInfoText}>
          {item.instructions}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.cameraButtonText}>Go to Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- App component (giữ nguyên Navigator) ---
const Stack = createNativeStackNavigator();

// Make sure you have VideoDisplayScreen component in your Stack.Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Startapp"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#f8f9fa',
          },
          headerTintColor: '#2c3e50',
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Startapp" 
          component={Startapp}
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={Signup}
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Exercise List' }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={({ route }) => ({ 
            title: route.params.item.title,
            animation: 'slide_from_right'
          })} 
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ 
            headerShown: false,
            animation: 'slide_from_bottom'
          }}
        />
        <Stack.Screen
          name="VideoDisplay"
          component={VideoDisplayScreen}
          options={{ title: 'Video Preview' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// Export screens separately if needed
export { HomeScreen, DetailScreen };

// --- Styles (giữ nguyên) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 40, alignItems: 'center' },
  header: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, color: '#2c3e50' },
  list: { width: '100%' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#ffffff', marginVertical: 8, marginHorizontal: 16, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  title: { fontSize: 20, color: '#34495e', fontWeight: '600', marginLeft: 15, flexShrink: 1 },
  image: { width: 70, height: 70, borderRadius: 8 },
  detailContainer: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  detailVideo: { width: '100%', aspectRatio: 16 / 9, borderRadius: 10, marginBottom: 20, backgroundColor: '#000' },
  detailTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#2c3e50', textAlign: 'center' },
  detailDescription: { fontSize: 16, color: '#34495e', textAlign: 'left', marginBottom: 20, lineHeight: 24 },
  additionalInfoContainer: { backgroundColor: '#f1f3f5', padding: 15, borderRadius: 8, width: '100%', marginBottom: 30 },
  additionalInfoTitle: { fontSize: 18, fontWeight: 'bold', color: '#495057', marginBottom: 10 },
  additionalInfoText: { fontSize: 15, color: '#495057', lineHeight: 22 },
  cameraButton: { alignSelf: 'center', marginTop: 15, paddingVertical: 12, paddingHorizontal: 30, backgroundColor: '#3498db', borderRadius: 25 },
  cameraButtonText: { fontSize: 17, color: '#fff', fontWeight: '600' },
});
