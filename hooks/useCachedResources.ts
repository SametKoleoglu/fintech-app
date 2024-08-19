import * as Font from "expo-font";

import { useState, useEffect } from "react";

import { FontAwesome } from "@expo/vector-icons";

import * as SplashScreen from "expo-splash-screen";

export default function useCachedResources() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        await Font.loadAsync({
          PlusJakartaSans: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
          PlusJakartaSansBold: require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
          PlusJakartaSansExtraBold: require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
          PlusJakartaBoldItalic: require("../assets/fonts/PlusJakartaSans-BoldItalic.ttf"),
          PlusJakartaMedium: require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
          PlusJakartaSansMediumItalic: require("../assets/fonts/PlusJakartaSans-MediumItalic.ttf"),

          ...FontAwesome.font,
        });
      } catch (e) {
        alert(e);
      } finally {
        setIsLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
