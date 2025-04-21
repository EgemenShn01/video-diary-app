import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useVideoStore } from "@/stores/videoStore";
import { ResizeMode, Video } from "expo-av";

type Props = {
  onResultPress: (videoId: string) => void;
};

export default function SearchBar({ onResultPress }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; name: string; uri: string }[]
  >([]);
  const videos = useVideoStore((s) => s.videos);

  useEffect(() => {
    const id = setTimeout(() => {
      if (query.trim().length >= 3) {
        const q = query.toLowerCase();
        const matched = videos.filter((v) => v.name.toLowerCase().includes(q));
        setResults(matched);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [query, videos]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="w-full rounded-xl">
        <View className="flex-row  items-center bg-white rounded-2xl px-4 py-2">
          <MaterialIcons name="search" size={22} color="#4b5563" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-800"
            placeholder="Videolarda ara..."
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={clearSearch} className="pl-2">
              <Text className="text-sm font-medium text-gray-600">Vazgeç</Text>
            </Pressable>
          )}
        </View>

        {query.trim().length >= 3 && (
          <FlatList
            data={
              results.length > 0 ? results : [{ id: "none", name: "", uri: "" }]
            }
            keyExtractor={(item) => item.id}
            className="bg-gray-800/90 rounded-b-2xl mt-1 max-h-56"
            renderItem={({ item }) =>
              item.id === "none" ? (
                <View className="px-4 py-3">
                  <Text className="text-gray-400 italic">Eşleşen öğe yok</Text>
                </View>
              ) : (
                <Pressable
                  className="flex-row items-center justify-between px-4 py-3 border-b border-gray-700"
                  onPress={() => {
                    clearSearch();
                    onResultPress(item.id);
                  }}
                >
                  <Text className="text-white mr-3 flex-1">{item.name}</Text>

                  <Video
                    source={{ uri: item.uri }}
                    style={{ width: 72, height: 40, borderRadius: 4 }}
                    resizeMode={ResizeMode.COVER}
                    isMuted
                    shouldPlay={false}
                  />
                </Pressable>
              )
            }
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
