import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface ButtonOutlineProps {
  title?: any;
  action?: () => void;
  children?: React.ReactNode;
}

const ButtonOutline: React.FC<ButtonOutlineProps> = ({
  title,
  action,
  children,
}: ButtonOutlineProps) => {
  return (
    <TouchableOpacity
      className="border-2 border-neutral-400 rounded-lg justify-center items-center py-3 flex-row space-x-2"
      onPress={action}
    >
      {children && <View>{children}</View>}
      <Text className="text-neutral-400 font-bold text-lg">{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonOutline;