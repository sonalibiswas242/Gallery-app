import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerStyle: {
            backgroundColor: '#001d3d',
          },
          headerTintColor: 'white',
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: '#778DA9',
          drawerStyle: {
            backgroundColor: '#001d3d',
          },
        }}
      >
        <Drawer.Screen name='Home' component={HomeScreen} />
        <Drawer.Screen name='Search' component={SearchScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
