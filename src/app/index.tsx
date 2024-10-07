import { Link } from "expo-router";
import React, { useState, useRef } from "react";
import { Text, View, Image, FlatList, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { runnerBg2 } from "../assets/images";
import { LinearGradient } from "expo-linear-gradient";
import {SearchInput}  from '@/components/searchInput'
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  const handleScroll = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    setIsScrolling(true);
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 200);
  };

  const shops = require('../../test-data/shops.json');

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-slate-200/90 dark:bg-gray-800">
      <FlatList
        data={filteredShops}
        keyExtractor={(item) => item.id}
        numColumns={2}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={() => (
          <LinearGradient
          colors={['rgba(255,255,255, 1', 'rgba(255,255,255, 0.5)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          >
            <WelcomeSection />
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} iconColor={"white"} classStyle={"bg-gray-800/80 dark:bg-gray-300/20 my-3 mx-auto"} inputClassStyle="text-white placeholder:text-gray-400" placeholder={"Where would you like to shop today?"}/>
          </LinearGradient>
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View className="flex-1 items-center w-1/2 bg-slate-400/50 dark:bg-blue-300/10 py-3 m-2  rounded-xl">
            <Link href={`(shops)/${item.id}`}>
              <Image 
                source={item.image} 
                className="w-48 h-32 rounded-xl" 
              />
            </Link>
            <Text className="mt-2 text-lg font-bold text-slate-600 dark:text-slate-200">
              {item.name}
            </Text>
          </View>
        )}
      />
      {!isScrolling && (
        <Footer />
      )}
    </View>
  );
}

function WelcomeSection() {
  return (
    <View className="w-100">
      <Image source={runnerBg2} className="w-[400px] h-[150px]" />
    </View>
  );
}

export function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View className="bg-slate-800 dark:bg-gray-800/90" style={{ paddingBottom: bottom }}>
      <View className="flex flex-row justify-evenly items-start px-2 py-2 mt-2">
          <Link href={'/'}>
            <View className="flex flex-col items-center">
              <MaterialCommunityIcons name="store-outline" size={26} color="#d4d4d8" />
            <Text className="text-xs font-bold text-slate-300">Stores</Text>
            </View>
          </Link>
          <Link href={'/(tabs)/orders'}>
            <View className="flex flex-col items-center">
                <Octicons name="package-dependencies" size={24} color="#d4d4d8" className="" />
                <Text className="text-xs font-bold text-slate-300">Orders</Text>
            </View>
          </Link>
          <Link href={'/(tabs)/contact'}>
            <View className="flex flex-col items-center">
                <MaterialCommunityIcons name="face-agent" size={24} color="#d4d4d8" />
                <Text className="text-xs font-bold text-slate-300">Contact Us</Text>
            </View>
          </Link>
          <Link href={'/(tabs)/contact'}>
            <View className="flex flex-col items-center">
              <FontAwesome name="user" size={24} color="#d4d4d8" />
              <Text className="text-xs font-bold text-slate-300">Profile</Text>
            </View>
          </Link>
      </View>
    </View>
  );
}
