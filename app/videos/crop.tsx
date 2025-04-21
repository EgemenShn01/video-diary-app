import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useVideoStore } from '@/stores/videoStore';
import { useCropVideo } from '@/hooks/useCropVideo';
import Slider from '@react-native-community/slider';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(View);

export default function CropScreen() {
  const router = useRouter();
  const { selectedVideo, cropStart, cropEnd, setCropTimes, setSelectedVideo } =
    useVideoStore();

  const [start, setStart] = useState(cropStart);
  const [end, setEnd] = useState(cropEnd);
  const [videoDuration, setVideoDuration] = useState(60);

  const mutation = useCropVideo();

  // puls
  const scale = useSharedValue(1);
  const btnAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleCrop = () => {
    if (!selectedVideo) {
      Alert.alert('Hata', 'Seçili video bulunamadı.');
      return;
    }
    if (end <= start) {
      Alert.alert('Hata', 'Bitiş süresi, başlangıçtan büyük olmalı.');
      return;
    }

    mutation.mutate(
      { uri: selectedVideo, start, end },
      {
        onSuccess: (croppedUri) => {
          setSelectedVideo(croppedUri);
          setCropTimes(start, end);
          router.push('/videos/metadata');
        },
        onError: () => Alert.alert('Hata', 'Kırpma işlemi başarısız oldu'),
      }
    );
  };

  if (!selectedVideo) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-lg text-red-500">Seçili video bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 pt-6">
      <Text className="text-xl font-bold mb-4 text-center text-white">
        Videoyu Kırp
      </Text>

      <Video
        source={{ uri: selectedVideo }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        style={{ width: '100%', height: 200, borderRadius: 8 }}
        onLoad={(s: AVPlaybackStatus) => {
          if (!s.isLoaded) return;
          const sec = Math.floor(s.durationMillis / 1000);
          setVideoDuration(sec);
          if (end > sec) setEnd(sec);
        }}
      />

      {/* Slider'lar */}
      <View className="mt-6">
        <Text className="text-center font-semibold text-white">
          Başlangıç: {start}s
        </Text>
        <Slider
          minimumValue={0}
          maximumValue={videoDuration - 1}
          step={1}
          value={start}
          onValueChange={setStart}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#3b82f6"
        />
        <Text className="text-xs text-white text-center mb-4">
          Videonun başından itibaren kırpmaya başla
        </Text>

        <Text className="text-center font-semibold text-white">
          Bitiş: {end}s
        </Text>
        <Slider
          minimumValue={start + 1}
          maximumValue={videoDuration}
          step={1}
          value={end}
          onValueChange={setEnd}
          minimumTrackTintColor="#10b981"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#10b981"
        />
        <Text className="text-xs text-white text-center">
          Bitiş süresi, başlangıçtan büyük olmalı
        </Text>
      </View>

      {/* CTA */}
      {mutation.isPending ? (
        <ActivityIndicator size="large" className="mt-10 self-center" />
      ) : (
        <AnimatedPressable
          style={[btnAnim, { marginTop: 32 }]}
          className="bg-green-600 px-10 py-5 rounded-3xl self-center"
          onTouchStart={() => (scale.value = withTiming(0.95))}
          onTouchEnd={() => (scale.value = withTiming(1))}
          onTouchCancel={() => (scale.value = withTiming(1))}
          onTouchEndCapture={handleCrop}
        >
          <Text className="text-white py-5 px-4 text-xl font-semibold">
            Kırp ve Devam Et
          </Text>
        </AnimatedPressable>
      )}
    </View>
  );
}
