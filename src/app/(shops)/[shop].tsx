import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Image, Text, ActivityIndicator, TouchableOpacity, Pressable, ScrollView, TextInput} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { shopNotFound } from '@/assets/images';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { SearchInput } from '@/components/searchInput';

type GroceryItem = {
  id: string;
  title: string;
  type: string;
  image: string;
  filename: string;
  price: string;
  description: string;
};

function Shop() {
  const _shop = useLocalSearchParams();
  const router = useRouter();
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GroceryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '60%'], []);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const data = await require('../../../test-data/shops.json');
        const foundShop = data.find((s: any) => s.id === _shop.shop);

        if (foundShop) {
          setShop(foundShop);
        } else {
          setError('We are having trouble reaching the providers of this store.');
        }
      } catch (err) {
        setError('Failed to fetch shop details');
      } finally {
        setLoading(false);
      }
    };
    fetchShopDetails();
  }, [_shop.shop]);

  const groceries: GroceryItem[] = require('../../../test-data/grocery.json');

  const filteredGroceries = groceries.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const renderContent = () => (
    <View className='p-5'>
      {selectedItem && (
        <>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedItem.title}</Text>
          <Text style={{ marginVertical: 10 }}>{selectedItem.description}</Text>
          <Text style={{ color: 'green', fontWeight: 'bold' }}>Price:{selectedItem.price}</Text>
          <View className='w-[180px] mt-5 left-0'>
            <TextInput className={`border-none p-3 mb-2 bg-slate-800/90 rounded-2xl text-slate-300`} placeholder="Specify Quantity" />
            <TouchableOpacity className='bg-slate-800 p-3 rounded-2xl flex flex-row justify-center'><Text className='text-white'>Add To Cart</Text></TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  const openBottomSheet = (item: GroceryItem) => {
    setSelectedItem(item);
    bottomSheetRef.current?.expand();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000ff" />;
  }

  if (error) {
    return (
      <View className='bg-gray-100 h-full flex justify-center items-center px-4'>
        <View className='bg-transparent shadow-lg rounded-lg p-6'>
          <View className='w-50 m-auto'>
            <Text className='text-2xl font-bold text-blue-600 mb-4'>Our Sincerest Apologies!</Text>
          </View>
          <Image source={shopNotFound} style={{ width: 300, height: 300 }} className='mx-auto mb-6' />
          <Text className='text-soft text-gray-600 mb-4'>{error}</Text>
          <TouchableOpacity
            onPress={() => router.push('/')}
            className='bg-blue-600 py-3 px-4 rounded-lg mb-4 flex flex-row justify-center items-center'
          >
            <Text className='text-white font-medium'>Go To Home</Text>
          </TouchableOpacity>
          <Text className='text-sm text-yellow-600 mb-4'>If this error persists, please report it to our team.</Text>
          <View className='w-50 m-auto'>
            <TouchableOpacity
              onPress={() => router.push('/')}
              className='bg-gray-900 py-3 px-6 rounded-lg'
            >
              <Text className='text-white font-medium'>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className='bg-white/10'>
        <ScrollView>
          <View className="fixed">
            <Image source={shop.image} style={{ width: 400, height: 150 }} className="z-0" />
            <Pressable onPress={() => router.back()} className="absolute top-[15px] left-0 z-20 p-3 bg-transparent/50">
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Pressable onPress={() => router.back()} className="absolute top-[10px] right-0 z-20 p-2 bg-blue-400/40">
              <MaterialIcons name="menu-open" size={24} color="white" />
            </Pressable>
            <Pressable onPress={() => router.back()} className="absolute top-[60px] right-0 z-20 p-2 bg-blue-400/40">
              <Feather name="phone-call" size={24} color="white" />
            </Pressable>
            <Pressable onPress={() => router.back()} className="absolute top-[110px] bg-blue-400/40 p-2 right-0 z-20">
              <MaterialIcons name="shopping-cart" size={24} color="white" />
            </Pressable>
          </View>

          <View className="flex flex-row justify-between px-2 mt-2">
            <Text className="font-semibold text-sm text-blue-400">Welcome to: {shop.name}</Text>
            <Text className="font-semibold text-sm text-slate-700" >
              We are currently:
              <Text className="text-yellow-400/80"> {shop.status}</Text>
            </Text>
          </View>

          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} iconColor={"white"} classStyle={"bg-slate-600/80 mt-5 text-white"} inputClassStyle='text-slate-200' placeholder={"what would you like to buy?"} />

          <View className="flex flex-row flex-wrap justify-evenly items-center mt-5">
            {filteredGroceries.map((item) => (
              <View
                key={item.id}
                className="w-1/3 items-center p-10 bg-blue-400/10 mx-2 my-3 rounded-xl"
              >
                <TouchableOpacity onPress={() => openBottomSheet(item)}>
                  <Image
                    source={{ uri: item.filename }}
                    className="w-30 h-20 rounded-lg"
                  />
                  <Text className="mt-2 text-sm font-bold text-gray-800 text-center">
                    {item.title.length > 20 ? `${item.title.substring(0, 20)}...` : item.title}
                  </Text>
                </TouchableOpacity>
                <Text className="mt-2 text-sm font-bold text-gray-800 text-center">{item.price}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
      >
        {renderContent()}
      </BottomSheet>
    </View>
  );
}

export default Shop;
