import {
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
} from 'react-native';
import { useState } from 'react';
import { useVideoStore } from '@/stores/videoStore';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { Video, ResizeMode } from 'expo-av';

const schema = z.object({
  name: z.string().min(1, 'İsim zorunludur'),
  description: z.string().optional(),
});

export default function MetadataScreen() {
  const router = useRouter();
  const { selectedVideo, addVideo, setSelectedVideo } = useVideoStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    const result = schema.safeParse({ name, description });

    if (!result.success) {
      const msg = result.error.issues[0]?.message || 'Hata var';
      Alert.alert('Form Hatası', msg);
      return;
    }
    if (!selectedVideo) {
      Alert.alert('Hata', 'Video seçili değil');
      return;
    }

    addVideo({
      id: Date.now().toString(),
      uri: selectedVideo,
      name,
      description,
    });

    setSelectedVideo(null);
    router.replace('/videos');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-4">
          <Text className="text-xl font-bold mb-4 text-center text-white">
            Video Bilgilerini Gir
          </Text>

          {selectedVideo && (
            <Video
              source={{ uri: selectedVideo }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              style={{ height: 200, borderRadius: 8, marginBottom: 16 }}
            />
          )}

          <Text className="mb-1 font-semibold text-white">İsim</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4 text-white"
            placeholder="Video adı girin"
            placeholderTextColor="#d1d5db"
            value={name}
            onChangeText={setName}
          />

          <Text className="mb-1 font-semibold text-white">Açıklama (opsiyonel)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-8 text-white"
            placeholder="Kısa açıklama"
            placeholderTextColor="#d1d5db"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Pressable
            className="bg-green-600 py-3 rounded-xl items-center mb-12"
            onPress={handleSave}
          >
            <Text className="text-white text-base font-semibold">Kaydet</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
