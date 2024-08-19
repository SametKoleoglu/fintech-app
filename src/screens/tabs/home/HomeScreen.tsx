import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "@/src/components";
import useSupabaseAuth from "@/hooks/useSupabaseAuth";
import { useFocusEffect } from "@react-navigation/native";
import { useUserStore } from "@/store/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { blurhash } from "../../auth/SplashScreen";
import { HomeScreenBanner } from "@/constants/HomeScreenBanner";
import { useQuery } from "@tanstack/react-query";
import { getAllCoins } from "../../../../utils/cryptoApi";
import Animated, { FadeInDown } from "react-native-reanimated";
import numeral from "numeral";

interface Coin {
  uuid: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: string;
  change: number;
  marketCap: string;
}

const HomeScreen = ({ navigation }: any) => {
  // STATES
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const { getUserProfile } = useSupabaseAuth();
  const { session } = useUserStore();

  // GET PROFILE
  async function handleGetProfile() {
    setLoading(true);

    try {
      const { data, error, status } = await getUserProfile();

      if (error && status !== 406) {
        setLoading(false);
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // HANDLE GET PROFILE!!!!
  useFocusEffect(
    useCallback(() => {
      if (session) {
        handleGetProfile();
      }
    }, [session])
  );

  const { data: CoinsData, isLoading: IsAllCoinsLoading } = useQuery({
    queryKey: ["allCoins"],
    queryFn: getAllCoins,
  });

  const RenderItem = ({ item, index }: { item: Coin; index: number }) => (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate("CoinDetails", {
          coinUuid: item.uuid,
          coinUrl: item.iconUrl,
        })
      }
      className="flex-row w-full items-center mb-16"
    >
      <Animated.View
        entering={FadeInDown.duration(100)
          .delay(index * 200)
          .springify()}
        className={"w-full flex-row items-center"}
      >
        <View className="w-[14%]">
          <View>
            <View className="w-10 h-10">
              <Image
                source={{ uri: item.iconUrl }}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
                shouldRasterizeIOS={true}
                className="w-full h-full flex-1"
              />
            </View>
          </View>
        </View>

        <View className="w-[50%] justify-start items-start">
          <Text className="text-lg font-bold">{item.name}</Text>

          <View className="flex-row items-center justify-center space-x-2">
            <Text className="text-sm font-medium text-neutral-500">
              {numeral(parseFloat(item?.price)).format("$0,0.00")}
            </Text>

            <Text
              className={`font-medium text-sm ${
                item.change < 0
                  ? "text-red-500"
                  : item.change > 0
                    ? "text-green-500"
                    : "text-gray-500"
              }`}
            >
              {item.change}%
            </Text>
          </View>
        </View>

        <View className="w-[30%] justify-start items-end">
          <Text className="text-base font-bold">{item.symbol}</Text>

          <View className="flex-row items-center justify-center space-x-2">
            <Text className="text-sm font-medium text-neutral-500">
              {item.marketCap.length > 9
                ? item.marketCap.slice(0, 9)
                : item.marketCap}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative">
        {/* HEADER */}
        <View className="w-full flex-row justify-between items-center px-5">
          <View className="w-3/4 flex-row space-x-2">
            <View className="justify-center items-center">
              <View className="w-12 h-12 rounded-2xl overflow-hidden">
                <Avatar url={avatarUrl} />
              </View>
            </View>

            <View className="left-1">
              <Text className="text-lg font-bold">
                Hi, {username ? username : "Guest"}
              </Text>
              <Text className="text-sm text-neutral-500">Have a good day</Text>
            </View>
          </View>

          <View className="py-5">
            <TouchableOpacity className="bg-neutral-600 rounded-lg p-1">
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* BALANCE */}
        <View className="mx-5 bg-neutral-700 rounded-[35px] overflow-hidden mt-5 mb-5">
          <View className="justify-center items-center py-5 rounded-[35px] bg-[#08e28f]">
            <Text className="text-sm font-medium text-neutral-700">
              {" "}
              Total Balance
            </Text>

            <Text className="text-3xl font-extrabold">$ 0.00</Text>
          </View>

          <View className="items-center justify-between flex-row py-5">
            {/* SEND TO,  REQUEST,  TOP UP,  MORE */}
            {HomeScreenBanner.map((item, index) => (
              <View
                key={index}
                className="w-1/4 items-center justify-center space-y-2"
              >
                <View className="w-11 h-11 overflow-hidden bg-[#3f3c41] rounded-full p-2">
                  <Image
                    source={item.icon}
                    placeholder={blurhash}
                    contentFit="cover"
                    transition={1000}
                    className="w-full h-full flex-1"
                  />
                </View>

                <Text className="text-white">{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* COINS */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{ flexGrow: 1, marginBottom: "40%", left: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 py-3 items-center">
            {IsAllCoinsLoading ? (
              <ActivityIndicator size="large" color={"#000"} />
            ) : (
              <FlatList
                nestedScrollEnabled={true}
                scrollEnabled={false}
                data={CoinsData.data.coins}
                keyExtractor={(item) => item.uuid}
                renderItem={RenderItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
