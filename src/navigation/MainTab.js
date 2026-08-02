import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../styles/themes';

// Import screens
import Chats from '../screens/Chats';
import Groups from '../screens/Groups';
import Channels from '../screens/Channels';
import Calls from '../screens/Calls';

const Tab = createBottomTabNavigator();

const MainTab = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Chats':
              iconName = focused ? 'chat' : 'chat-outline';
              break;
            case 'Groups':
              iconName = focused ? 'account-group' : 'account-group-outline';
              break;
            case 'Channels':
              iconName = focused ? 'broadcast' : 'broadcast-outline';
              break;
            case 'Calls':
              iconName = focused ? 'phone' : 'phone-outline';
              break;
            default:
              iconName = 'home';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.bgSecondary,
          borderTopColor: colors.borderGlass,
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.bgPrimary,
          borderBottomColor: colors.borderGlass,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Chats" 
        component={Chats}
        options={{
          tabBarLabel: 'Chats',
        }}
      />
      <Tab.Screen 
        name="Groups" 
        component={Groups}
        options={{
          tabBarLabel: 'Groups',
        }}
      />
      <Tab.Screen 
        name="Channels" 
        component={Channels}
        options={{
          tabBarLabel: 'Channels',
        }}
      />
      <Tab.Screen 
        name="Calls" 
        component={Calls}
        options={{
          tabBarLabel: 'Calls',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
