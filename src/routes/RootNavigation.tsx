import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import AuthNavigation from "./AuthNavigation";
import TabNavigation from "./TabNavigation";
import { useUserStore } from "@/store/useUserStore";
import { StatusBar } from "expo-status-bar";

const Stack = createStackNavigator();

export default function RootNavigation() {
  const { session } = useUserStore();

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          animationEnabled: true,
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        {session && session.user ? (
          <Stack.Screen name="TabNavigation" component={TabNavigation} />
        ) : (
          <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
