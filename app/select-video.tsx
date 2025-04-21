import * as ImagePicker from 'expo-image-picker';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useVideoStore } from '@/stores/videoStore';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';

export default function SelectVideoScreen() {
  const router = useRouter();
  const setSelectedVideo = useVideoStore((s) => s.setSelectedVideo);
  const [loading, setLoading] = useState(false);

  const spin = useSharedValue(0);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const pickVideo = async () => {
    setLoading(true);
    spin.value = withRepeat(withTiming(360, { duration: 800 }), -1);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setLoading(false);
      spin.value = 0;
      Alert.alert('İzin Gerekli', 'Galeriye erişim izni vermen gerekiyor.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setSelectedVideo(result.assets[0].uri);
      router.replace('/videos/crop');
    } else {
      setLoading(false);
      spin.value = 0;
    }
  };

  const scale = useSharedValue(1);
  const btnAnim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="flex-1 items-center justify-center px-4"
    >
      <Text className="text-2xl font-bold text-center mb-6 text-white">
        Video Seç
      </Text>

      {loading ? (
        <Animated.View style={[spinnerStyle]}>
          <ActivityIndicator size="large" color="#60a5fa" />
        </Animated.View>
      ) : (
        <Animated.View style={btnAnim}>
          <Pressable
            className="bg-blue-600 px-6 py-3 rounded-xl"
            onPress={pickVideo}
            onPressIn={() => (scale.value = withTiming(0.95))}
            onPressOut={() => (scale.value = withTiming(1))}
          >
            <Text className="text-white text-base">Galeri'den Video Seç</Text>
          </Pressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}
