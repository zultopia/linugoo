import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens
import GameMapPage from './base';
import ClassDetailPage from './detail/[id]/page';

// Create the game navigation stack
const Stack = createStackNavigator();

export default function GameNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="GameMap"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="GameMap" component={GameMapPage} />
        <Stack.Screen name="ClassDetail" component={ClassDetailPage} />
        
        {/* Class 1 screens */}
        <Stack.Screen name="Class1Lesson1" component={Class1Lesson1} />
        
        {/* Class 2 screens */}
        <Stack.Screen name="Class2Lesson1" component={Class2Lesson1} />
        
        {/* Class 3 screens */}
        <Stack.Screen name="Class3Lesson1" component={Class3Lesson1} />
        
        {/* Class 4 screens */}
        <Stack.Screen name="Class4Lesson1" component={Class4Lesson1} />
        
        {/* Class 5 screens */}
        <Stack.Screen name="Class5Lesson1" component={Class5Lesson1} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Placeholder components for lessons
// These would be replaced with actual lesson components
const Class1Lesson1 = () => <Placeholder text="Kelas 1: Pelajaran 1" />;
const Class2Lesson1 = () => <Placeholder text="Kelas 2: Pelajaran 1" />;
const Class3Lesson1 = () => <Placeholder text="Kelas 3: Pelajaran 1" />;
const Class4Lesson1 = () => <Placeholder text="Kelas 4: Pelajaran 1" />;
const Class5Lesson1 = () => <Placeholder text="Kelas 5: Pelajaran 1" />;

// Simple placeholder component
function Placeholder({ text }: { text: string }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24 }}>{text}</Text>
      <Text style={{ marginTop: 20 }}>Pelajaran sedang dalam pengembangan</Text>
    </View>
  );
}

import { View, Text } from 'react-native';