import React from 'react';
import { View, Text, Linking, Button, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const stores = require('../../../test-data/shops.json')

export default function App() {
  const router = useRouter();

  return (
    <View className='flex-1'>
      <View className='bg-transparent/40 z-20 flex flex-row justify-between pe-4 backdrop-blur-lg'>
        <TouchableOpacity
          className=''
          onPress={() => router.replace('/')}>
          <Text className='text-blue-500 text-lg flex flex-row py-5'><Text className='mt-2'> Back </Text> </Text>
        </TouchableOpacity>
        <Text className='text-yellow-500 pt-7'>You have no active orders</Text>
      </View>
      <MapView
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
        showsScale
        showsIndoors
        style={StyleSheet.absoluteFill}
      >
        {stores.map(store => (
          <Marker
            key={store.id}
            coordinate={{
              latitude: store.lat,
              longitude: store.long,
            }}
          >
            <Callout>
              <View style={{ width: 150 }}>
                <Text style={{ fontWeight: 'bold' }}>{store.name}</Text>
                <Text>{store.operating_hours}</Text>
                <Button
                  title="Visit Store"
                  onPress={() => router.replace(`/(shops)/${store.id}`)}
                />
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
