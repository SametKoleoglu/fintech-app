import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useSupabaseAuth from "@/hooks/useSupabaseAuth";
import { Image } from "expo-image";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUserStore } from "@/store/useUserStore";
import { useFocusEffect } from "@react-navigation/native";
import { Avatar } from "@/src/components";

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  // STATES
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const { getUserProfile } = useSupabaseAuth();
  const { session } = useUserStore();

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

  async function handleSignOut() {
    await signOut();
  }

  const { signOut } = useSupabaseAuth();
  return (
    <View className="flex-1 bg-white">
      <View className="">
        {/* AVATAR */}
        <View className="items-center justify-center py-14 pb-20 bg-secondary">
          <View className="border-2 overflow-hidden border-white rounded-3xl">
            <Avatar size={100} url={avatarUrl} />
          </View>

          <View className="w-full py-4 items-center">
            <Text className="text-lg font-bold text-white">
              {username ? username : "Loading..."}
            </Text>
          </View>
        </View>

        <View
          className="bg-white px-4 py-6 -mt-11"
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <Text className="text-lg font-bold pb-2">Account Review</Text>
        </View>


        {/* EDIT PROFILE BUTTON */}
        <View className="py-3 p-2 bg-gray-100 rounded-xl border-2 border-gray-300 my-3 mx-3">
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View className="flex-row items-center justify-center space-x-2">
              <View className="bg-secondary rounded-lg p-2">
                <MaterialIcons name="person" size={24} color="#fff" />
              </View>

              <Text className="text-lg text-gray-500 font-semibold">
                Edit Profile
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={22} />
          </TouchableOpacity>
        </View>
        
        {/* CHANGE PASSWORD BUTTON */}
        <View className="py-3 p-2 bg-gray-100 rounded-xl border-2 border-gray-300 my-3 mx-3">
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View className="flex-row items-center justify-center space-x-2">
              <View className="bg-secondary rounded-lg p-2">
                <MaterialIcons name="lock" size={24} color="#fff" />
              </View>

              <Text className="text-lg text-gray-500 font-semibold">
                Change Password
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={22} />
          </TouchableOpacity>
        </View>


        {/* SIGN OUT BUTTON */}
        <View className="py-3 p-2 bg-gray-100 rounded-xl border-2 border-gray-300 my-3 mx-3">
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => handleSignOut()}
          >
            <View className="flex-row items-center justify-center space-x-2">
              <View className="bg-secondary rounded-lg p-2">
                <MaterialIcons name="logout" size={24} color="#fff" />
              </View>

              <Text className="text-lg text-gray-500 font-semibold">
                Sign Out
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={22} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
