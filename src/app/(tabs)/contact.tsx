import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { contactUs } from '@/assets/images';
import { FontAwesome, FontAwesome6, Feather,  Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';
import { Footer } from '../index';

const Contact = () => {
  const router = useRouter();
  const [rating, setRating] = useState(0); 
  const [feedback, setFeedback] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  const handleScroll = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    setIsScrolling(true);
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const submitFeedback = () => {
    console.log('Rating:', rating);
    console.log('Feedback:', feedback);
    router.push('/'); 
  };

  return (
    <View className='bg-white dark:bg-gray-700 h-full flex justify-center'>
    <ScrollView showsVerticalScrollIndicator={false} style={{paddingBottom: 90}} onScroll={handleScroll}>
      <View className='bg-transparent rounded-lg p-6'>
        <View className='w-50 m-auto'>
          <Text className='text-2xl font-bold text-orange-400 mb-4'>Get in touch with us!</Text>
        </View>
        <Image source={contactUs} style={{ width: 300, height: 380 }} className='mx-auto' />

        <View className='my-5'>
            <Text className='text-3xl font-bold text-gray-800/80 dark:text-white text-center'>Contact Us</Text>
            <View className='flex flex-row justify-evenly items-center flex-wrap mt-3'>
                <Fontisto name="whatsapp" size={32} color="#4ade80" />
                <Feather name="phone-call" size={32} color="#06b6d4" />
                <Feather name="message-square" size={32} color="#047857" />
                <Fontisto name="email" size={36} color="#fde047" />
            </View>
        </View>

        <View className='mb-6'>
            <Text className='text-lg font-bold text-gray-800/80 dark:text-white text-center'>Engage with us</Text>
            <View className='flex flex-row justify-evenly items-center flex-wrap mt-3'>
                <Fontisto name="instagram" size={24} color="#f43f5e" />
                <FontAwesome name="facebook-official" size={24} color="#2563eb" />
                <FontAwesome6 name="x-twitter" size={24} color="black" />
                <MaterialCommunityIcons name="youtube-subscription" size={24} color="#dc2626" />
                <MaterialCommunityIcons name="discord" size={26} color="#4338ca" />
            </View>
        </View>
        
        {/* Rating System */}

        <Text className='text-lg font-bold text-gray-600 mb-2 dark:text-white text-center'>Rate your experience:</Text>
        <View className='flex flex-row justify-center mb-4'>
          {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(star)}>
              <FontAwesome name={star <= rating ? 'star' : 'star-o'} size={32} color={star <= rating ? '#FFD700' : '#C0C0C0'} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback Input */}
        <Text className='text-lg font-bold text-gray-600 dark:text-white mb-2 text-center'>Leave a comment:</Text>
        <TextInput
          className='bg-white dark:bg-gray-800 text-gray-700 dark:text-white border border-gray-300 rounded-lg p-3 mb-4 w-full'
          placeholder='Share your feedback here...'
          placeholderTextColor='#888'
          value={feedback}
          onChangeText={setFeedback}
          multiline
          />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={submitFeedback}
          className='bg-blue-600 py-3 px-4 rounded-lg mb-2 flex flex-row justify-center items-center'
          >
          <Text className='text-white font-medium'>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
    <Text className="text-center text-gray-500 dark:text-gray-400 pb-6">
        © {new Date().getFullYear()} Insinuates Investments Pvt Ltd
      </Text>
    </ScrollView>
    {!isScrolling && <Footer />}
    </View>
  );
};

export default Contact;
