import React from 'react';
import { View, Text, Image } from 'react-native';
import { runnerBg2 } from '@/assets/images';
const BundlingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image 
        source={runnerBg2} 
        className="size-24 mb-5"
      />
      <Text className="text-xl font-bold mb-2">Runner Digital Platform</Text>
      <Text className="text-lg text-gray-600 mb-2">In partnership with Insinuates Investments Inc</Text>
      <Text className="text-sm text-gray-400">designed by kdtk</Text>
    </View>
  );
};

export default BundlingScreen;