import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import useSupabaseAuth from "@/hooks/useSupabaseAuth";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface Props {
  size?: number;
  url?: string | null;
  onUpload?: (filePath: string) => void;
  showUpload?: boolean;
}

const Avatar = ({ size = 50, url, onUpload, showUpload }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  const { getUserProfile } = useSupabaseAuth();
  const navigation:any = useNavigation();

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        const { data } = await getUserProfile();
        setAvatarUrl(data?.avatar_url);
      }

      if (data) {
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setAvatarUrl(fr.result as string);
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image !", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        exif: false,
      });

      if (!result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri !!!");
      }

      const arraybuffer = await fetch(image.uri).then((r) => r.arrayBuffer());

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <TouchableOpacity
          className="relative"
          onPress={() => navigation.navigate("ProfileTab")}
        >
          <Image
            source={{ uri: avatarUrl }}
            accessibilityLabel="Avatar"
            style={[avatarSize, styles.avatar, styles.image]}
          />
        </TouchableOpacity>
      ) : (
        <View
          className="items-center justify-center"
          style={[avatarSize, styles.avatar, styles.image]}
        >
          <ActivityIndicator color="white" />
        </View>
      )}

      {showUpload && (
        <View className="absolute bottom-0 right-0">
          {!uploading ? (
            <TouchableOpacity onPress={uploadAvatar}>
              <MaterialIcons
                name="cloud-upload"
                size={25}
                color="#000"
                style={{ paddingRight: 5 }}
              />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator color={"white"} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    maxWidth: "100%",
    position: "relative",
  },
  image: {
    paddingTop: 0,
    objectFit: "cover",
  },
  noImage: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "rgb(200,200,200)",
    borderRadius: 20,
    backgroundColor: "gray",
  },
});

export default Avatar;
