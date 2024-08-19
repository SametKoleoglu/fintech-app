import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useCallback, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SearchCoin } from "@/utils/cryptoApi";
import { debounce } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import numeral from "numeral";
import { blurhash } from "../../auth/SplashScreen";

interface Coin {
  uuid: string;
  name: string;
  symbol: string;
  iconUrl: string;
  price: string;
  change: number;
  marketCap: string;
}

const SearchScreen = () => {
  // STATES
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>([]);

  const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation();

  const renderItem = ({ item, index }: { item: Coin; index: number }) => (
    <TouchableOpacity
      key={index}
      onPress={() => navigate("CoinDetails", { coinUuid: item.uuid })}
      className="flex-row w-full items-center px-4 py-5"
    >
      <Animated.View
        entering={FadeInDown.duration(100)
          .delay(index * 200)
          .springify()}
        className={"w-full flex-row items-center"}
      >
        <View className="w-[15%]">
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

        <View className="w-[53%] justify-start items-start">
          <Text className="text-lg font-bold">{item.name}</Text>

          <View className="flex-row items-center justify-center space-x-2">
            <Text className="text-sm font-medium text-neutral-500">
              {numeral(parseFloat(item?.price)).format("$0,0.00")}
            </Text>
          </View>
        </View>

        <View className="w-[30%] justify-start items-end">
          <Text className="text-base font-bold">{item.symbol}</Text>

          <View className="flex-row items-center justify-center space-x-2">
            <Text className="text-sm font-medium text-neutral-500">
              {item?.marketCap?.length > 9
                ? item.marketCap.slice(0, 9)
                : item.marketCap}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  const { navigate: navigateHome }: NavigationProp<HomeNavigationType> =
    useNavigation();

  const handleSearch = async (query: string) => {

    if (query && query.length > 2) {
      setLoading(true);

      try {
        const results = await SearchCoin(query);

        if (results) setResults(results);
      } catch (error) {
        console.log(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="w-full flex-row justify-between items-center px-4 pb-4">
        <View className="w-3/4 flex-row space-x-2">
          <Text className="font-bold text-3xl">Search</Text>
        </View>
      </View>

      {/* SEARCH FIELD */}
      <View className="mx-4 mb-3 flex-row p-3 border justify-between items-center bg-white rounded-lg shadow-sm">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search coin"
          placeholderTextColor={"gray"}
          className="flex-1 pl-2 font-medium tracking-wider"
        />

        <TouchableOpacity
          onPress={() => {
            navigateHome("Home");
          }}
        >
          <XMarkIcon size="25" color={"black"} />
        </TouchableOpacity>
      </View>

      <View className="mt-4">
        {loading ? (
          <View>
            <ActivityIndicator size={"large"} color={"#164bd8"} />
          </View>
        ) : (
          <FlatList
            data={results?.data?.coins}
            contentContainerStyle={{ paddingBottom: 80 }}
            keyExtractor={(item) => item.uuid}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
