import { View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import numeral from "numeral";
import { getAllCoins, getCoinDetails, getCoinHistory } from "@/utils/cryptoApi";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import Animated, { SharedValue } from "react-native-reanimated";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { blurhash } from "../auth/SplashScreen";

const CoinDetailsScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { coinUuid } = route.params;

  // STATES
  const [lineData, setLineData] = useState<any>([]);
  const [item, setItem] = useState<any>({});

  const font = useFont(
    require("../../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    12
  );

  const { data: CoinsDetails, isLoading: CoinDetailsLoading } = useQuery({
    queryKey: ["CoinDetails", coinUuid],
    queryFn: async () => coinUuid && (await getCoinDetails(coinUuid)),
  });

  const { data: CoinsHistory, isLoading: CoinHistoryLoading } = useQuery({
    queryKey: ["CoinHistory", coinUuid],
    queryFn: async () => coinUuid && (await getCoinHistory(coinUuid)),
  });

  useEffect(() => {
    console.log("CoinsHistory -> ", CoinsHistory?.data.history);
    if (CoinsHistory && CoinsHistory.data.history) {
      const datasets = CoinsHistory.data.history.map((item: any) => ({
        price: parseFloat(item.price),
        timestamp: item.timestamp,
      }));

      setLineData(datasets);
    }

    if (CoinsDetails && CoinsDetails.data.coin) {
      setItem(CoinsDetails.data.coin);
    }
  }, [CoinsDetails, CoinsHistory]);

  function ToolTip({
    x,
    y,
  }: {
    x: SharedValue<number>;
    y: SharedValue<number>;
  }) {
    return <Circle cx={x} cy={y} r={8} color={"red"} />;
  }

  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  return (
    <View className="flex-1 bg-white">
      {CoinHistoryLoading && CoinDetailsLoading ? (
        <View className="absolute z-50 h-full w-full items-center justify-center">
          <View className="w-full h-full items-center justify-center bg-black opacity-[0.45]"></View>

          <View className="absolute">
            <ActivityIndicator size={"large"} color={"white"} />
          </View>
        </View>
      ) : (
        <SafeAreaView>
          {/* HEADER */}
          <View className="flex-row items-center justify-between px-5 mt-1">
            <TouchableOpacity
              className="border-2 border-neutral-500 rounded-full p-0.5"
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={30}
                color="gray"
              />
            </TouchableOpacity>

            <View>
              <Text className="font-bold text-lg">{item.symbol}</Text>
            </View>

            <View className="border-2 border-neutral-500 rounded-full p-0.5">
              <Entypo name="dots-three-horizontal" size={24} color="gray" />
            </View>
          </View>

          {/* BODY */}
          <View className="px-5 items-center justify-center py-1">
            <Text className={`font-bold text-xl text-neutral-500`}>
              {numeral(parseFloat(item.price)).format("$0,0.00")}
            </Text>
          </View>

          {item && (
            <View className="flex-row justify-center items-center space-x-2 px-4">
              <View className="flex-row w-full py-4 items-center">
                {/* IMAGE */}
                <View className="w-[15%]">
                  <View className="w-11 h-11">
                    <Image
                      source={{ uri: item.iconUrl }}
                      className="flex-1 w-full h-full"
                      placeholder={blurhash}
                      transition={1000}
                      contentFit="cover"
                    />
                  </View>
                </View>

                {/* PRICE && CHANGE */}
                <View className="w-[55%] items-start justify-start">
                  <Text className=" font-bold text-lg ">{item.name}</Text>

                  <View className="flex-row space-x-2 items-center justify-center">
                    <Text className="font-medium text-sm text-neutral-500">
                      {numeral(parseFloat(item.price)).format("$0,0.00%")}
                    </Text>

                    <Text
                      className={`font-medium text-sm ${item.change < 0 ? "text-red-500" : item.change > 0 ? "text-green-500" : "text-gray-500"}`}
                    >
                      {item.change}%
                    </Text>
                  </View>
                </View>

                <View className="w-[30%] justify-start items-end">
                  <Text className="text-base font-bold">{item.symbol}</Text>

                  <View className="flex-row items-center justify-center space-x-2">
                    <Text className="font-medium text-sm text-neutral-500">
                      {item?.marketCap?.length > 9
                        ? item.marketCap.slice(0, 9)
                        : item.marketCap}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      )}

      <View style={{ height: 400, paddingHorizontal: 10 }}>
        {lineData && lineData.length > 0 ? (
          <CartesianChart
            chartPressState={state}
            axisOptions={{
              font,
              tickCount: 8,
              labelOffset: { x: -1, y: 0 },
              labelColor: "green",
              formatXLabel: (ms) => format(new Date(ms * 1000), "MM/dd"),
            }}
            data={lineData}
            xKey={"timestamp"}
            yKeys={["price"]}
          >
            {({ points }) => (
              <>
                <Line points={points.price} color={"green"} strokeWidth={2} />
                {isActive && (
                  <ToolTip x={state.x.position} y={state.y.price.position} />
                )}
              </>
            )}
          </CartesianChart>
        ) : (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={"large"} color={"green"} />
          </View>
        )}
      </View>

      <View className="py-5 px-4">
        {/* ALL TIME HIGH */}
        <View className="flex-row justify-between">
          <Text className="text-base font-bold text-neutral-500">
            All Time High
          </Text>
          <Text className="font-bold text-xl">
            {numeral(parseFloat(item?.allTimeHigh?.price)).format("$0,0.00")}
          </Text>
        </View>

        {/* NUMBER OF MARKETS */}
        <View className="flex-row justify-between">
          <Text className="text-base font-bold text-neutral-500">
            Number Of Markets
          </Text>
          <Text className="font-bold text-xl">
            {numeral(parseFloat(item?.numberOfMarkets)).format("$0,0.00")}
          </Text>
        </View>

        {/* NUMBER OF EXCHANGES */}
        <View className="flex-row justify-between">
          <Text className="text-base font-bold text-neutral-500">
            Number Of Exchanges
          </Text>
          <Text className="font-bold text-xl">
            {numeral(parseFloat(item?.numberOfExchanges)).format("$0,0.00")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CoinDetailsScreen;
