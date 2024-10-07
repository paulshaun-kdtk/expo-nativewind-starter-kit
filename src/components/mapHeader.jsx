import { View } from "react-native";

export function MapHeader({ containerStyle="", content }) {
    return (
        <View className={`absolute mt-0 h-10 ${containerStyle}`}>
            {content}
        </View>
    )
}