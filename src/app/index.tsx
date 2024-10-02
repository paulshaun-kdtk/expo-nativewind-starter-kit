import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, View, Image, FlatList, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { runnerBg2 } from "../assets/images";
import { LinearGradient } from "expo-linear-gradient";
import {SearchInput}  from '@/components/searchInput'

export default function Page() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // const toggleTheme = () => {
  //   setIsDarkTheme((prev) => !prev);
  // };

  const shops = require('../../test-data/shops.json');

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className={`flex flex-1 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <FlatList
        data={filteredShops}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={() => (
          <LinearGradient
          colors={['rgba(255,255,255, 1', 'rgba(255,255,255, 0.5)']}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          >
            <WelcomeSection />
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} iconColor={"white"} classStyle={"bg-gray-800/80 my-3"} inputClassStyle="text-white" placeholder={"Where would you like to shop today?"}/>
          </LinearGradient>
        )}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View className="flex-1 items-center w-1/2 bg-slate-400/50 py-3 m-2  rounded-xl">
            <Link href={`(shops)/${item.id}`}>
              <Image 
                source={item.image} 
                className="w-48 h-32 rounded-xl" 
              />
            </Link>
            <Text className="mt-2 text-lg font-bold text-slate-600">
              {item.name}
            </Text>
          </View>
        )}
      />
      <Footer />
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



function Footer() {
  const { bottom } = useSafeAreaInsets();
  return (
    <View className="bg-blue-200 dark:bg-gray-800 native:hidden" style={{ paddingBottom: bottom }}>
      <Text className="text-center text-gray-700 dark:text-gray-400 py-6">
        © {new Date().getFullYear()} Insinuates Investments Pvt Ltd
      </Text>
    </View>
  );
}
