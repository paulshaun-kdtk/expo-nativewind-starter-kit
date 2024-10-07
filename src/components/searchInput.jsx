import { View, TextInput } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';

export function SearchInput({ searchQuery, setSearchQuery, classStyle, iconColor, placeholder, inputClassStyle="" }) {
    return (
      <View className={`px-4 py-1 flex flex-row rounded-3xl ${classStyle}`}>
        <EvilIcons name="search" size={24} color={iconColor} className="mt-2" />
        <TextInput
          className={`border-none p-3 bg-transparent rounded-lg ${inputClassStyle}`}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    );
  }
