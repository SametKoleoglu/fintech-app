import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import useSupabaseAuth from "@/hooks/useSupabaseAuth";
import { useUserStore } from "@/store/useUserStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { Avatar, Button } from "@/src/components";
import { Input } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { err } from "react-native-svg";

export default function EditProfileScreen({ navigation }: { navigation: any }) {
  // STATES
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const { getUserProfile, updateUserProfile } = useSupabaseAuth();
  const { session } = useUserStore();

  // FUNCTIONS
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
        setFullname(data.full_name);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    setLoading(true);
    try {
      const { error } = await updateUserProfile(username, fullname, avatarUrl);

      if (error) {
        setLoading(false);
        Alert.alert("Error", `Error updating profile!  ${error.message}`);
      } else {
        Alert.alert("Success", `Profile updated successfully!`);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      handleGetProfile();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View>
        <View className="flex-row items-center justify-between px-4">
          <View className="w-1/3">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View className="border-2 border-neutral-500 w-10 h-10 p-2 items-center justify-center rounded-full">
                <ChevronLeftIcon size={23} strokeWidth={2} color="black" />
              </View>
            </TouchableOpacity>
          </View>

          <View className="w-1/3">
            <Text className="text-xl font-bold">Edit Profile</Text>
          </View>

          <View className="w-1/3"></View>
        </View>

        {/* AVATAR */}
        <View>
          <View className="items-center justify-center py-2">
            <View className="border-2 overflow-hidden border-secondary rounded-3xl">
              <Avatar
                size={100}
                url={avatarUrl}
                showUpload={true}
                onUpload={(url: string) => {
                  setAvatarUrl(url);
                }}
              />
            </View>

            <View className="w-full py-4 items-center">
              <Text className="text-lg font-bold text-white">
                {username ? username : "Loading..."}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-4">
          <View>
            <Input label="Email" value={session?.user?.email} disabled />
          </View>

          {/* USERNAME */}
          <View className="space-x-1">
            <Input
              label="Username"
              value={username || ""}
              onChangeText={(text) => setUsername(text)}
            />
          </View>

          {/* FULLNAME */}
          <View className="space-x-1">
            <Input
              label="Fullname"
              value={fullname || ""}
              onChangeText={(text) => setFullname(text)}
            />
          </View>

          <Button
            title={
              loading ? <ActivityIndicator color="white" /> : "Update Profile"
            }
            action={() => handleUpdateProfile()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
