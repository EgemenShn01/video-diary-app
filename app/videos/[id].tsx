import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoStore } from '@/stores/videoStore';
import { useState, useEffect } from 'react';
import { Video, ResizeMode } from 'expo-av';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const APressable = Animated.createAnimatedComponent(Pressable);

function PulsButton({
  children,
  onPress,
  className,
}: {
  children: React.ReactNode;
  onPress: () => void;
  className: string;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    ...(Platform.OS === 'web' && {
      transition: 'background-color 120ms',
    }),
  }));

  return (
    <APressable
      style={anim}
      className={className}
      onPress={onPress}
      onPressIn={() => (scale.value = withTiming(0.95))}
      onPressOut={() => (scale.value = withTiming(1))}
      {...(Platform.OS === 'web' && {
        onMouseEnter: () => (scale.value = withTiming(1.03)),
        onMouseLeave: () => (scale.value = withTiming(1)),
      })}
    >
      {children}
    </APressable>
  );
}

export default function VideoDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { videos, updateVideo, removeVideo, setSelectedVideo } = useVideoStore();

  const video = videos.find((v) => v.id === id);
  const [name, setName] = useState(video?.name || '');
  const [description, setDescription] = useState(video?.description || '');

  useEffect(() => {
    if (!video) {
      Alert.alert('Hata', 'Video bulunamadı');
      router.replace('/videos');
    }
  }, [video]);

  const handleUpdate = () => {
    if (!video) return;
    updateVideo(video.id, { name, description });
    Alert.alert('Başarılı', 'Video güncellendi');
  };

  const handleCropAgain = () => {
    if (!video) return;
    setSelectedVideo(video.uri);
    router.push('/videos/crop');
  };

  const confirmDelete = () => {
    if (!video) return;
    Alert.alert('Emin misin?', 'Bu video silinecek', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => {
          removeVideo(video.id);
          router.replace('/videos');
        },
      },
    ]);
  };

  if (!video) return null;

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-xl font-bold mb-4 text-center text-white">
        Video Detay
      </Text>

      <TouchableOpacity onPress={handleCropAgain}>
        <Video
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          style={{ height: 200, borderRadius: 8 }}
        />
      </TouchableOpacity>

      <Text className="mt-4 mb-1 text-white font-semibold">İsim</Text>
      <TextInput
        className="border border-gray-400 rounded-lg p-2 mb-4 text-white"
        value={name}
        onChangeText={setName}
        placeholder="Video adı"
        placeholderTextColor="#d1d5db"
      />

      <Text className="mb-1 text-white font-semibold">Açıklama</Text>
      <TextInput
        className="border border-gray-400 rounded-lg p-2 mb-8 text-white"
        value={description}
        onChangeText={setDescription}
        placeholder="Kısa açıklama"
        placeholderTextColor="#d1d5db"
        multiline
      />

      <PulsButton
        onPress={handleUpdate}
        className="bg-blue-600 py-3 rounded-xl items-center mb-4"
      >
        <Text className="text-white text-base font-semibold">Kaydet</Text>
      </PulsButton>

      <PulsButton
        onPress={confirmDelete}
        className="bg-red-500 py-3 rounded-xl items-center mb-4"
      >
        <Text className="text-white text-base font-semibold">Sil</Text>
      </PulsButton>

      <PulsButton
        onPress={() => router.back()}
        className="bg-gray-300 py-3 rounded-xl items-center"
      >
        <Text className="text-black text-base font-semibold">Geri Dön</Text>
      </PulsButton>
    </ScrollView>
  );
}
