import { View, Text, FlatList, Pressable } from "react-native";
import { useVideoStore } from "@/stores/videoStore";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const router = useRouter();
  const { videos, toggleFavorite } = useVideoStore();

  const favorites = videos.filter((v) => v.isFavorite);

  const renderItem = ({ item }: any) => (
    <Pressable
      className="mb-6 p-3 border border-gray-300 rounded-xl"
      onPress={() => router.push(`/videos/${item.id}`)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">{item.name}</Text>
        <Pressable onPress={() => toggleFavorite(item.id)}>
          <MaterialIcons name="star" size={24} color="#facc15" />
        </Pressable>
      </View>

      <Video
        source={{ uri: item.uri }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        style={{ height: 200, borderRadius: 8 }}
      />

      {item.description ? (
        <Text className="text-gray-500 mt-2">{item.description}</Text>
      ) : null}
    </Pressable>
  );

  return (
    <View className="flex-1  p-4 ">
      <Text className="text-white text-xl font-semibold">
        Favori Videolarım
      </Text>

      {favorites.length === 0 ? (
        <Text className="text-center text-gray-500">
          Henüz favoriye eklenmiş video yok.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
