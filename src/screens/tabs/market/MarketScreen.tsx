import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "../../auth/SplashScreen";
import { useQuery } from "@tanstack/react-query";
import { getAllCoins } from "../../../../utils/cryptoApi";
import Animated, { FadeInDown } from "react-native-reanimated";
import numeral from "numeral";
import { useState } from "react";

interface Coin {
  uuid: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: string;
  change: number;
  marketCap: string;
}

const MarketScreen = ({ navigation }: any) => {
  // STATES
  const [topGainers, setTopGainers] = useState([]);
  const [topLoser, setTopLoser] = useState([]);
  const [active, setActive] = useState("all");

  const allCoins = () => {
    setActive("all");
  };

  const calculateTopGainers = () => {
    setActive("gainers");

    const gainers = CoinsData.data.coins.filter(
      (coin) => parseFloat(coin.change) > 0
    );

    setTopGainers(gainers);
  };

  const calculateTopLosers = () => {
    setActive("losers");

    const losers = CoinsData.data.coins.filter(
      (coin) => parseFloat(coin.change) < 0
    );

    setTopLoser(losers);
  };

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
      className="flex-row w-full items-center mb-14"
    >
      <Animated.View
        entering={FadeInDown.duration(100)
          .delay(index * 200)
          .springify()}
        className={"w-full flex-row items-center"}
      >
        <View className="w-[12%] mr-5">
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
        <View className="w-full flex-row items-center px-4 pb-4">
          <View className="w-3/4 flex-row space-x-2">
            <View>
              <Text className="text-2xl font-bold">MARKET</Text>
            </View>
          </View>
        </View>

        {/* COIN SELECT */}
        <View className="px-4 flex-row justify-between items-center pb-4">
          {/* ALL */}
          <TouchableOpacity
            className={`w-1/4 items-center justify-center py-1 ${
              active === "all" ? "border-b-4 border-green-800" : ""
            }`}
            onPress={allCoins}
          >
            <Text
              className={`text-lg ${active === "all" ? "font-extrabold" : ""}`}
            >
              All
            </Text>
          </TouchableOpacity>

          {/* GAINERS */}
          <TouchableOpacity
            className={`w-1/4 items-center justify-center py-1 ${
              active === "gainers" ? "border-b-4 border-green-800" : ""
            }`}
            onPress={calculateTopGainers}
          >
            <Text
              className={`text-lg ${
                active === "gainers" ? "font-extrabold" : ""
              }`}
            >
              Gainers
            </Text>
          </TouchableOpacity>

          {/* LOSERS */}
          <TouchableOpacity
            className={`w-1/4 items-center justify-center py-1 ${
              active === "losers" ? "border-b-4 border-green-800" : ""
            }`}
            onPress={calculateTopLosers}
          >
            <Text
              className={`text-lg ${
                active === "losers" ? "font-extrabold" : ""
              }`}
            >
              Losers
            </Text>
          </TouchableOpacity>
        </View>

        {/* COINS */}
        <ScrollView
          style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 py-5 items-center">
            {/* ALL */}
            {active === "all" && (
              <View className="items-center px-4">
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
            )}

            {/* GAINERS */}
            {active === "gainers" && (
              <View className="items-center px-4 py-1 mb-5">
                {IsAllCoinsLoading ? (
                  <ActivityIndicator size="large" color={"#000"} />
                ) : (
                  <FlatList
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    data={
                      active === "gainers" ? topGainers : CoinsData.data.coins
                    }
                    keyExtractor={(item) => item.uuid}
                    renderItem={RenderItem}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            )}

            {/* LOSERS */}
            {active === "losers" && (
              <View className="items-center px-4 py-1 mb-5">
                {IsAllCoinsLoading ? (
                  <ActivityIndicator size="large" color={"#000"} />
                ) : (
                  <FlatList
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    data={active === "losers" ? topLoser : CoinsData.data.coins}
                    keyExtractor={(item) => item.uuid}
                    renderItem={RenderItem}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MarketScreen;
