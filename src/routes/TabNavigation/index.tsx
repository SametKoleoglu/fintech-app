import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeNavigation from "./HomeNavigation";
import MarketNavigation from "./MarketNavigation";
import NewsNavigation from "./NewsNavigation";
import SearchNavigation from "./SearchNavigation";
import ProfileNavigation from "./ProfileNavigation";
import { TransitionPresets } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Market") {
            iconName = "stats-chart-outline";
          } else if (route.name === "Search") {
            iconName = "search-outline";
          } else if (route.name === "News") {
            iconName = "newspaper-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          const customizeSize = 24;

          return (
            <Ionicons name={iconName} size={customizeSize} color={color} />
          );
        },
        tabBarActiveTintColor: "#164b28",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        ...TransitionPresets.SlideFromRightIOS,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      })}
    >
      <Tab.Screen
        name="Home Tab"
        component={HomeNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />

      <Tab.Screen
        name="Market Tab"
        component={MarketNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
          tabBarLabel: "Market",
        }}
      />

      <Tab.Screen
        name="Search Tab"
        component={SearchNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
          tabBarLabel: "Search",
        }}
      />
      <Tab.Screen
        name="News Tab"
        component={NewsNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={size} color={color} />
          ),
          tabBarLabel: "News",
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
