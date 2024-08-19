import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BookmarkSquareIcon,
  ChevronLeftIcon,
  ShareIcon,
} from "react-native-heroicons/outline";
import { WebView } from "react-native-webview";

const { height, width } = Dimensions.get("window");

const NewsDetailsScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  // DATA
  const { params: item } = route;

  // STATE
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="w-full flex-row items-center justify-between px-4 pt-1 pb-4 bg-white">
        <View className="bg-gray-100 p-2 items-center justify-center rounded-full">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={23} strokeWidth={2} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center space-x-3 rounded-full">
          <View className="bg-gray-100 rounded-full p-2">
            <ShareIcon size={23} strokeWidth={2} color="black" />
          </View>

          <View className="bg-gray-100 rounded-full p-2">
            <BookmarkSquareIcon size={25} strokeWidth={2} color="black" />
          </View>
        </View>
      </View>

      <WebView
        source={{ uri: item.url }}
        onLoadStart={() => setVisible(true)}
        onLoadEnd={() => setVisible(false)}
      />

      {visible && (
        <ActivityIndicator
          size={"large"}
          color={"green"}
          style={{
            position: "absolute",
            top: height / 2,
            left: width / 2,
            zIndex: 1,              
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default NewsDetailsScreen;
