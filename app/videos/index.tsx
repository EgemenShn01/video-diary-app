import {
  View,
  Text,
  Alert,
  BackHandler,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useVideoStore } from '@/stores/videoStore';

type VideoItem = {
  id: string;
  uri: string;
  name: string;
  description?: string;
  isFavorite?: boolean;
};

type CardProps = {
  item: VideoItem;
  index: number;
  onNavigate: () => void;
  onToggleFav: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function VideoCard({
  item,
  index,
  onNavigate,
  onToggleFav,
  onEdit,
  onDelete,
}: CardProps) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(index * 40)}
      style={anim}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => (scale.value = withTiming(0.97))}
        onPressOut={() => (scale.value = withTiming(1))}
        onPress={onNavigate}
        className="mb-6 p-3 border border-gray-400/40 rounded-xl"
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-white">{item.name}</Text>

          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={onToggleFav}>
              <MaterialIcons
                name={item.isFavorite ? 'star' : 'star-border'}
                size={24}
                color={item.isFavorite ? '#facc15' : '#9ca3af'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={onEdit}>
              <MaterialIcons name="edit" size={24} color="#60a5fa" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onDelete}>
              <MaterialIcons name="delete" size={24} color="#f87171" />
            </TouchableOpacity>
          </View>
        </View>

        <Video
          source={{ uri: item.uri }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          style={{ height: 200, borderRadius: 8 }}
        />

        {!!item.description && (
          <Text className="text-white mt-2">{item.description}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function VideoListScreen() {
  const { videos, toggleFavorite, removeVideo, setSelectedVideo } =
    useVideoStore();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const onBack = () => {
        router.replace('/select-video');
        return true;
      };
      if (Platform.OS === 'android') {
        BackHandler.addEventListener('hardwareBackPress', onBack);
      }
      return () => {
        if (Platform.OS === 'android') {
          BackHandler.removeEventListener('hardwareBackPress', onBack);
        }
      };
    }, [])
  );

  const confirmDelete = (id: string) =>
    Alert.alert('Videoyu Sil', 'Bu videoyu silmek istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => removeVideo(id) },
    ]);

  return (
    <Animated.View
      className="flex-1 p-4"
      entering={FadeInDown.duration(500)}
    >
      <Text className="text-2xl font-bold text-white mb-4 text-center">
        Kaydedilen Videolar
      </Text>

      {videos.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white mb-4">Henüz video eklenmedi.</Text>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-full"
            onPress={() => router.push('/select-video')}
          >
            <Text className="text-white font-semibold">Video Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <VideoCard
              item={item}
              index={index}
              onNavigate={() => router.push(`/videos/${item.id}`)}
              onToggleFav={() => toggleFavorite(item.id)}
              onEdit={() => {
                setSelectedVideo(item.uri);
                router.push(`/videos/${item.id}`);
              }}
              onDelete={() => confirmDelete(item.id)}
            />
          )}
        />
      )}
    </Animated.View>
  );
}
