import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Image, Text, ActivityIndicator, TouchableOpacity, Pressable, ScrollView, TextInput, ImageBackground} from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import { shopNotFound } from '@/assets/images';
import { InformationModal } from '@/components/modals';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import { useColorScheme } from "react-native";
import { SearchInput } from '@/components/searchInput';

type GroceryItem = {
  id: string;
  title: string;
  type: string;
  image: string;
  filename: string;
  price: number;
  description: string;
  quantity: number;
};

function Shop() {
  const _shop = useLocalSearchParams();
  const router = useRouter();
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GroceryItem | GroceryItem>(null);
  const [informationModal, setInformationModal] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [message, setMessage] = useState(null);
  const [itemsInCart, setItemsInCart] = useState<GroceryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  const [groceries, setGroceries] = useState([])
  
  const handleScroll = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    setIsScrolling(true);
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 3600);
  };

  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === "dark";

  const bottomSheetBackgroundColor = { backgroundColor: isDarkMode ? "#1e293b" : "#ecfdf5" };

  const totalPrice = Math.round(
    itemsInCart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
  ) / 100
  
  const addToCart = (item: GroceryItem) => {
    setItemsInCart((prevItems) => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };
  
  const removeFromCart = (item: GroceryItem) => {
    setItemsInCart((prevItems) => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        return prevItems.filter(i => i.id !== item.id);
      }
    });
  };  

  const showMessage = (message) => {
      setMessage(message)
      setTimeout(() => setMessage(null), 3000)
  }

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const data = await import('../../../test-data/shops.json');
        const foundShop = data.default.find((s: any) => s.id === _shop.shop);
  
        if (foundShop) {
          setShop(foundShop); 
          try {
            if (foundShop.categories.includes("Grocery")) {
              const groceriesData = await import('../../../test-data/grocery.json');
              setGroceries(groceriesData.default);
            } else if (foundShop.categories.includes("Restaurant")) {
              const menuData = await import('../../../test-data/menu.json');
              setGroceries(menuData.default);
            } else if (foundShop.categories.includes("Hardware")) {
              const hardWareData = await import('../../../test-data/hardware.json');
              setGroceries(hardWareData.default);
            } else if (foundShop.categories.includes("Retail")) {
              const retailData = await import('../../../test-data/retail.json');
              setGroceries(retailData.default);
            }
          } catch (err) {
            console.log(err);
          }
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
  

  

  const filteredGroceries = useMemo(() => groceries.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery, groceries]);
    
  const groupedGroceries = filteredGroceries.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  const relatedGroceries = groceries.filter(item => 
    selectedItem ? item.type === selectedItem.type : false
  );


  
  const renderContent = () => (
    <View className="p-5">
      {selectedItem && (
        <>
          {message && (
            <Text className="text-yellow-500/90 dark:text-yelow-400 text-sm font-bold text-center mb-2">
              {message}
            </Text>
          )}
          <Text className='dark:text-white' style={{ fontSize: 20, fontWeight: 'bold' }}>
            {selectedItem.title}
          </Text>
          <Image
            source={{ uri: selectedItem.filename }}
            style={{ width: 350, height: 100 }}
          />
          <Text className="text-green-500/90 dark:text-white font-extrabold py-2">
            Price: ${selectedItem.price}
          </Text>
          <View className="w-full mt-5">
            <View className="flex flex-row flex-wrap justify-start w-full mb-2">
              <TouchableOpacity
                onPress={() =>
                  (addToCart(selectedItem), showMessage(`Item ${selectedItem.title} has been added to your cart`))
                }
                className="bg-slate-800/95 dark:bg-slate-500 p-3 rounded-lg flex flex-row justify-center w-[150px]"
              >
                <Feather name="arrow-up" size={22} className="mx-2" color="white" />
                <Text className="text-white mt-1">Add To Cart</Text>
              </TouchableOpacity>
  
              <Feather
                name="arrow-up"
                size={32}
                className="mx-4"
                color={ isDarkMode ? "#3b82f6" : "#10b981"}
                onPress={() =>
                  (addToCart(selectedItem), showMessage(`Item ${selectedItem.title} has been added to your cart`))
                }
              />
              <Feather
                name="arrow-down"
                size={32}
                color="red"
                onPress={() =>
                  (removeFromCart(selectedItem), showMessage(`Item ${selectedItem.title} has been removed from your cart`))
                }
              />
            </View>
            <View className="mt-3 flex flex-row justify-start w-full">
              <TouchableOpacity className="p-3 bg-slate-600 rounded-md">
                <Text className="text-green-500">Total: ${totalPrice}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-slate-700 ml-2 rounded-md  flex flex-row p-3 justify-evenly items-start"
                onPress={() => setCartModal(true)}
              >
                <MaterialIcons name="shopping-cart" size={18} color="white" />
                <Text className="text-white">View Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => router.push('/')} 
                  className="bg-gray-800/90 dark:bg-slate-700/20 py-3 px-4 rounded-lg ml-2 flex flex-row justify-center items-center">
                  <Text className="text-yellow-400 font-medium"><Feather name="file-text" size={20} /> Checkout</Text>
                </TouchableOpacity>
              
            </View>
  
            <TouchableOpacity
              onPress={() => setShowNote(!showNote)}
              className="bg-slate-600 dark:bg-slate-400 mt-3 py-3 px-4 rounded-lg flex flex-row justify-center items-center w-full"
            >
              <Text className="text-white font-medium">
                <MaterialCommunityIcons
                  name="notebook-edit-outline"
                  size={22}
                  color="white"
                  className="mr-2"
                />
                Attach note with item
              </Text>
            </TouchableOpacity>
  
            {showNote && (
              <View className="px-4 py-1 flex flex-row items-center rounded-lg bg-slate-800/90 w-full my-2">
                <TextInput
                  className="border-none p-3 my-2 bg-transparent rounded-lg text-slate-300 flex-1"
                  placeholder="e.g get the one with the red cap"
                />
                <Text className="text-white font-medium">Send</Text>
              </View>
            )}
          </View>
          <View className="mt-2 w-full">
            <Text className="text-md font-semibold text-center mt-10 dark:text-white">Related Items</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ padding: 5 }}
            >
              {/* <ImageBackground
                source={{ uri: selectedItem.filename }}
                style={{ width: '100%', padding: 5, }}
              > */}
                  {relatedGroceries &&
                    relatedGroceries.map((item) => (
                      <TouchableOpacity
                        onPress={() => openBottomSheet(item)}
                        key={item.id}
                        className="items-center p-5 bg-emerald-500/90 dark:bg-blue-500/60 mx-2 my-3 rounded-xl"
                      >
                        <Text className="mt-2 text-sm font-bold text-gray-100 dark:text-gray-300 text-center">
                          {item.title.length > 20
                            ? `${item.title.substring(0, 20)}...`
                            : item.title}
                        </Text>
                        <Text className="mt-2 text-sm font-bold text-slate-700/90 dark:text-white text-center">
                          ${item.price}
                        </Text>
                      </TouchableOpacity>
                    ))}
              {/* </ImageBackground> */}
            </ScrollView>

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
    return <ActivityIndicator size="large" color="#60a5fa" className='m-auto' animating />;
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
    <View style={{ flex: 1 }} className='bg-white/10 dark:bg-gray-900'>
        <View className='flex flex-row justify-between items-start bg-transparent/10'>
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} iconColor={"white"} classStyle={"bg-slate-600/80 dark:bg-gray-300/10 mt-5 ml-2 mb-4 text-white"} inputClassStyle='text-slate-200 placeholder:text-slate-400' placeholder={"What would you like to buy?"} />      
          <View className='flex flex-row justify-evenly mt-5'>
            {itemsInCart.length > 0 && (
              <Pressable className='bg-blue-400/80 dark:bg-blue-400/10 mx-2 py-3 px-2 rounded-lg flex flex-row' onPress={() => setCartModal(true)}>
                <MaterialIcons name='shopping-cart' size={24} color='white' />
                <Text className="font-semibold text-md text-red-400">{itemsInCart.length}</Text>
              </Pressable>
              )}
              <Pressable className='bg-gray-700/80 dark:bg-gray-300/10 mx-2 py-3 px-2 rounded-2xl' onPress={() => router.back()}>
                <Ionicons name='arrow-back' size={24} color='white' />
              </Pressable>
            </View>
          </View>
        <ScrollView onScroll={handleScroll}>
            <>
          <View className="fixed">
            <Image source={shop.image} style={{ width: 400, height: 150 }} className="z-0" />
            <Pressable onPress={() => setInformationModal(true)} className="absolute top-[10px] right-0 p-2 bg-emerald-400/40 dark:bg-blue-400/40 rounded-md">
              <MaterialIcons name="menu-open" size={24} color="white" />
            </Pressable>
            <Pressable onPress={() => setContactModal(true)} className="absolute top-[60px] right-0 p-2 bg-emerald-400/40 dark:bg-blue-400/40 rounded-md">
              <Feather name="phone-call" size={24} color="white" />
            </Pressable>
            {itemsInCart.length > 0 && (
              <Pressable onPress={() => setCartModal(true)} className="absolute flex flex-row top-[110px] bg-emerald-400/40 dark:bg-blue-400/40 p-2 right-0 rounded-md">
                <MaterialIcons name="shopping-cart" size={20} color="white" />
                <Text className="font-semibold text-md text-red-400">{itemsInCart.length}</Text>
              </Pressable>
            )}
          </View>

          <View className="flex flex-row justify-between px-2 mt-2">
            <Text className="font-semibold text-sm text-slate-600 dark:text-blue-400">Welcome to: {shop.name}</Text>
            <Text className="font-semibold text-sm text-slate-700 dark:text-white" >
              We are currently:
              <Text className="text-yellow-400"> {shop.status}</Text>
            </Text>
          </View>
            </>
          
          <View className="flex flex-row justify-evenly gap-x-1 flex-wrap mt-5">
        {Object.entries(groupedGroceries).map(([category, items]) => (
        <View key={category} className="mb-5">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 ml-2 mb-2">{category}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex flex-row"
          >
            {items.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => openBottomSheet(item)} className="w-100 py-3">
              <View
                className="w-[150px] h-[170px] items-center bg-emerald-500/30 dark:bg-blue-500/30 mr-3 rounded-xl"
              >
                    <Image
                      source={{ uri: item.filename }}
                      className="h-28 w-[148px]"
                    />
                  <Text className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-100/80 text-center">
                    {item.title.length > 20 ? `${item.title.substring(0, 20)}...` : item.title}
                  </Text>
                  <Text className="mt-5 text-sm font-bold text-gray-800 dark:text-white text-center">
                    ${item.price}
                  </Text>
              </View>
                </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
          </View>
        </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={bottomSheetBackgroundColor}
      >
        {renderContent()}
      </BottomSheet>

      <InformationModal
        visible={informationModal}
        onClose={() => setInformationModal(false)}
        modalStyle={'bg-white/90'}
        content={
         <View className="flex flex-col items-center">  
            <MaterialIcons name="close" size={24} color="black" className='absolute top-0 right-0' onPress={() => setInformationModal(false)} />
            <Text className="text-xl font-bold text-blue-600 my-4">About {shop.name} </Text>
            <Text className="text-sm text-gray-600 mb-4">Operating Hours: <Text className='font-bold text-[13px]'>{shop.operating_hours}</Text> </Text>
            <Text className="text-sm text-gray-600 mb-4">Estimated delivery time after order: <Text className='font-bold text-[13px]'>25 mins</Text></Text>
            <Text className="text-sm text-gray-600 mb-4">Active Drivers In Area: <Text className='font-bold text-[13px]'>3</Text></Text>
            <Text className="text-sm text-gray-600 mb-4">Exact Location : <Text className='font-bold text-[13px]'>{shop.location}</Text> <Link href={'/(tabs)/orders/'} className='p-10 bg-emerald-500/80 text-white'> <Fontisto name="map" size={18} color="gray" /> View On Map</Link></Text>
            <Text className="text-sm text-gray-600 mb-4">Average Consumer Rating: <Text className='py-3 bg-yellow-400/80 text-white px-5'><FontAwesome6 name="star-half-alt" size={12} color="white" /> {shop.rating} </Text> </Text>
            <View className="flex flex-row justify-center">
              <TouchableOpacity
                onPress={() => router.push('/')} 
                className="bg-slate-600 py-3 px-4 rounded-lg flex flex-row justify-center items-center">
                <Text className="text-white font-medium"><MaterialCommunityIcons name="web" size={18} color="white" /> Visit Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
      <InformationModal
        visible={contactModal}
        onClose={() => setContactModal(false)}
        content={
          <View>  
          <MaterialIcons name="close" size={24} color="black" className='absolute top-0 right-0' onPress={() => setContactModal(false)} />
            <View className="flex flex-col items-center mt-5 text-end">
          <Text className="text-lg font-bold text-black/80 my-4">Speak to one of our operations Administrator for this store</Text>
          <View className={`px-4 py-1 flex flex-row rounded-3xl bg-slate-800/60 max-w-90`}>
          <MaterialCommunityIcons name="chat-processing" size={32} color="white" className='mt-2'/>
            <TextInput
              className='p-5 bg-transparent-10 text-white rounded-sm'
              placeholder='Enter text'
              multiline = {true} 
              numberOfLines = {4}/>
          <TouchableOpacity
            className="transparent px-4 rounded-lg flex flex-row justify-center items-center">
            <Text className="text-white font-medium">Send</Text>
          </TouchableOpacity>
          </View>
          <Text className="text-md mb-2 font-semibold text-slate-600 mt-4">Or talk to us directly.</Text>
          <TouchableOpacity
            onPress={() => router.push('/')} 
            className="bg-emerald-500 py-3 px-4 rounded-lg flex flex-row justify-center items-center">
            <Text className="text-white font-medium"><MaterialCommunityIcons name="whatsapp" size={20} color="white" /> Chat with us on whatsapp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/')} 
            className="bg-emerald-500/80 py-3 px-4 rounded-lg flex flex-row justify-center my-3 items-center">
            <Text className="text-white font-medium"><Entypo name="chat" size={18} color="white" />Chat with us on messenger</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/')} 
            className="bg-emerald-500/60 py-3 px-4 rounded-lg flex flex-row justify-center items-center">
            <Text className="text-white font-medium"> <Feather name="phone-call" size={18} color="white" /> Call us</Text>
          </TouchableOpacity>
          <Text className="text-sm mt-2 text-slate-400">Sms charges and call charges may apply*</Text>
              </View>
        </View>
        }
        modalStyle={'bg-white/90'}
      />

    <InformationModal
      visible={cartModal}
      onClose={() => setCartModal(false)}
      modalStyle={'bg-white/90'}
      content={
        <View className="flex flex-col items-center justify-start h-auto w-[290px] bg-transparent rounded-lg shadow-lg p-4">
          <MaterialIcons name="close" size={24} color="black" className='absolute top-0 right-0' onPress={() => setCartModal(false)} />
          {message && (
            <Text className="text-yellow-400/90 text-center">{message}</Text>
          )}
          <ScrollView style={{height: 200}} contentContainerStyle={{paddingBottom: 20}}>
            <Text className="text-xl font-bold text-blue-600">Your Cart</Text>
            {itemsInCart.map((item, index) => (
              <View key={index} className='mt-5'>
                <View className="flex flex-row justify-start items-center py-2 bg-blue-400/30 rounded-lg w-[300px]">
                  <Image
                    source={{ uri: item.filename }}
                    className="w-15 h-10 rounded-lg"
                  />
                  <Text className="text-sm font-bold text-gray-800 text-center mx-2">
                    {item.title.length > 15 ? `${item.title.substring(0, 15)}...` : item.title}
                  </Text>
                  <Text className="text-sm font-bold text-green-600 text-center">${item.price}</Text>
                  <Text className="text-yellow-400 bg-red-500 rounded-3xl font-bold px-2 mx-1">{item.quantity}</Text> 
                  <Feather name="arrow-up" size={22} className='ml-2' color="blue" onPress={() => (addToCart(item), showMessage(`Item ${item.title} has been added to your cart`))} />
                  <Feather name="arrow-down" size={22} color="red" onPress={() => (removeFromCart(item), showMessage(`Item ${selectedItem.title} has been removed from your cart`))} />
                </View>
              </View>
            ))}
            {!itemsInCart.length && (
              <View className='mt-[50px]'>
                <Text className="text-center text-gray-600 text-lg font-semibold ">Your cart is empty</Text>
                <TouchableOpacity
                  onPress={() => setCartModal(false)} 
                  className="bg-slate-600 py-3 px-4 rounded-lg mt-2">
                  <Text className="text-white font-medium">Continue Shopping</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
            {itemsInCart.length > 0 && (
              <View className="flex flex-row justify-between mt-4 bottom-0">
                <TouchableOpacity className='p-3 bg-slate-600 mr-4 rounded-md'><Text className='text-green-500'> Total: ${totalPrice} </Text></TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/')} 
                  className="bg-gray-700 py-3 px-4 rounded-lg flex flex-row justify-center items-center">
                  <Text className="text-white font-medium"><Feather name="file-text" size={20} color="white"/> Checkout</Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      }
    />

    </View>
  );
}

export default Shop;
