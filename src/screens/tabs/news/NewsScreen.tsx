import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getCryptoNews } from "@/utils/cryptoApi";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BookmarkSquareIcon } from "react-native-heroicons/outline";

const NewsScreen = ({navigation}: any) => {
  const { data: NewsData, isLoading: IsNewsLoading } = useQuery({
    queryKey: ["cryptonews"],
    queryFn: getCryptoNews,
  });


  const handleClick = (item:any) => {
    navigation.navigate("NewsDetails", item);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      key={index}
      className="mx-4 my-4 space-x-1"
      onPress={() => handleClick(item)}
    >
      <View className="flex-row justify-start w-full shadow-sm">
        {/* IMAGE */}
        <View className="w-[20%] items-center justify-start">
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: hp(10), height: hp(10) }}
            className="rounded-lg"
          />
        </View>

        {/* CONTENT */}
        <View className="w-[70%] space-y-1 pl-5 justify-center">
          {/* DESCRIPTION */}
          <Text className="text-xs font-bold text-gray-800">
            {item?.description?.length > 20
              ? item?.description.slice(0, 20) + "..."
              : item?.description}
          </Text>

          {/* TITLE */}
          <Text className="Capitalize max-w-[90%] text-neutral-800">
            {item?.title?.length > 50
              ? item?.title.slice(0, 50) + "..."
              : item?.title}
          </Text>

          {/* CREATED AT */}

          <Text className="text-xs text-neutral-700">
            {new Date(item?.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* BOOKMARK */}
        <View className="w-[10%] justify-center">
          <BookmarkSquareIcon size={hp(4)} color={"gray"} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white space-y-2">
      {/* HEADER */}
      <View className="w-full flex-row items-center justify-between pb-4 px-4">
        <View className="w-3/4 flex-row space-x-2">
          <Text className="text-3xl font-bold">Crypto News</Text>
        </View>
      </View>

      {/* MAIN NEWS */}
      <View className="flex-1">
        {NewsData && NewsData.data.length > 0 ? (
          <FlatList
            data={NewsData.data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={"large"} color={"black"} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default NewsScreen;
