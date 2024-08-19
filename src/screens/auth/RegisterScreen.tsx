import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { Breaker, Button, ButtonOutline } from "@/src/components";
import { AntDesign, Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { supabase } from "@/lib/supabase";

const { height, width } = Dimensions.get("window");

const RegisterScreen = () => {
  // STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { navigate: navigateAuth }: NavigationProp<AuthNavigationType> =
    useNavigation();

  async function signUpWithEmail() {
    setIsLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (!session) {
      setEmail("");
      setPassword("");
      Alert.alert("Please check your email and password !!!");
    }

    if (error) {
      setIsLoading(false);
      Alert.alert("Error", error.message);
    } else if (!error && session != null) {
      setEmail("");
      setPassword("");
      navigateAuth("Login");
      Alert.alert("Success !", "Account created successfully !!!");
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      {isLoading && (
        <View className="absolute z-50 h-full w-full justify-center items-center">
          <View className="h-full w-full justify-center items-center bg-black opacity-[0.5]"></View>
          <View className="absolute">
            <ActivityIndicator size="large" color={"white"} />
          </View>
        </View>
      )}

      <View className="flex-1 justify-center items-center relative ">
        <View
          className="w-full px-5 space-y-5 justify-center"
          style={{
            height: height * 0.75,
          }}
        >
          {/* WELCOME TEXT */}
          <Animated.View
            className={"justify-center items-center"}
            entering={FadeInDown.duration(200).delay(200).springify()}
          >
            <Text
              className="text-neutral-700 text-2xl leading-[60px]"
              style={{ fontFamily: "PlusJakartaSansBold" }}
            >
              Register to join us.
            </Text>

            <Text className="text-neutral-500 text-sm font-medium ">
              Welcome! Please enter your details.
            </Text>
          </Animated.View>

          {/* TEXT  INPUT */}
          <Animated.View
            className={"py-8 space-y-8"}
            entering={FadeInDown.duration(100).delay(300).springify()}
          >
            {/* EMAIL */}
            <View className="border-2 border-gray-300 rounded-lg">
              <TextInput
                className="p-4"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                placeholderTextColor={"gray"}
                placeholder="Email"
              />
            </View>

            {/* PASSWORD */}
            <View className="flex-row items-center border-2 border-gray-300 rounded-lg">
              <TextInput
                className="p-4 w-[90%] mr-2"
                onChangeText={setPassword}
                value={password}
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                placeholderTextColor={"gray"}
                placeholder="Password"
              />

              {/* SHOW PASSWORD */}
              <TouchableOpacity
                className="pl-1"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Feather name="eye" size={20} />
                ) : (
                  <Feather name="eye-off" size={20} />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* BUTTON */}
          <Animated.View
            className={"w-full justify-start"}
            entering={FadeInDown.duration(100).delay(300).springify()}
          >
            <View className="pb-5">
              <Button title={"Register"} action={() => signUpWithEmail()} />
            </View>
          </Animated.View>

          {/* BREAKER LINE */}
          <View>
            <Breaker />
          </View>

          {/* THIRD PARTY AUTHENTICATION */}
          <View className="w-full justify-normal">
            <Animated.View
              entering={FadeInDown.duration(100).delay(600).springify()}
              className={"pb-5"}
            >
              <ButtonOutline title={"Continue with Google"}>
                <AntDesign name="google" size={20} color="gray" />
              </ButtonOutline>
            </Animated.View>
          </View>

          {/* ALREADY HAVE AN ACCOUNT? */}
          <Animated.View
            className={"flex-row justify-center items-center"}
            entering={FadeInDown.duration(100).delay(700).springify()}
          >
            <Text
              className="text-lg font-medium leading-[35px] text-center text-neutral-500"
              style={{ fontFamily: "PlusJakartaSansMedium" }}
            >
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigateAuth("Login")}>
              <Text
                style={{ fontFamily: "PlusJakartaSansBold" }}
                className="text-lg text-neutral-700 font-medium leading-[35px] text-center"
              >
                {" "}
                Login
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;