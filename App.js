import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screen Imports
import Startapp from './screens/startapp';
import Login from './screens/Login';
import Signup from './screens/Signup';
import { HomeScreen, DetailScreen } from './execersise/homescreen'; // Đảm bảo './execersise/homescreen' export cả hai
import CameraScreen from './components/camera';
import VideoDisplayScreen from './screens/VideoDisplayScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Startapp"
        screenOptions={{ headerShown: false }} // Mặc định: ẩn header
      >
        {/* Luồng xác thực */}
        <Stack.Screen name="Startapp" component={Startapp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />

        {/* Luồng chính của ứng dụng */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: true, title: 'Exercise List' }} // Hiện header ở đây
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({
            headerShown: true, // Hiện header ở đây
            // Đặt title động, cung cấp giá trị dự phòng nếu params hoặc item không tồn tại
            title: route.params?.item?.title || 'Details' 
          })}
        />

        {/* Camera & Hiển thị Video (Modals / Navigation cụ thể) */}
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom'
          }}
        />
        <Stack.Screen
          name="VideoDisplayScreen"
          component={VideoDisplayScreen}
          options={{
            headerShown: false,
            presentation: 'modal'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}