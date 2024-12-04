import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { shopNotFound } from '@/assets/images';

export const ErrorPage = ({error}) => { 
    const router = useRouter();
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
  )
}
