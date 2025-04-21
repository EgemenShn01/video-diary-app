import { View, Text, Pressable, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolateColor,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import SearchBar from "@/components/SearchBar";
import { Video, ResizeMode } from "expo-av";
import { useVideoStore } from "@/stores/videoStore";

const ALnk = Animated.createAnimatedComponent(Pressable);
function LinkButton({
  href,
  label,
  delay = 0,
}: {
  href: string;
  label: string;
  delay?: number;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Link href={href} asChild>
      <ALnk
        style={anim}
        entering={FadeInUp.duration(500).delay(delay)}
        onPressIn={() => (scale.value = withTiming(0.95))}
        onPressOut={() => (scale.value = withTiming(1))}
        {...(Platform.OS === "web" && {
          onMouseEnter: () => (scale.value = withTiming(1.05)),
          onMouseLeave: () => (scale.value = withTiming(1)),
        })}
        className="flex-row items-center space-x-2"
      >
        <Text className="text-white text-[30px] font-semibold">{label}</Text>
      </ALnk>
    </Link>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const router = useRouter();
  const videos = useVideoStore((s) => s.videos);
  const latest = videos[videos.length - 1];

  const pressed = useSharedValue(0);
  const btnStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pressed.value,
      [0, 1],
      ["rgb(55,65,81)", "rgb(255,255,255)"]
    ),
  }));

  return (
    <Animated.View
      className="flex-1 px-6 pt-12 justify-between"
      entering={FadeInDown.duration(600)}
    >
      <Animated.View entering={FadeInUp.duration(600).delay(150)}>
        <Text className="text-5xl font-extrabold text-white tracking-tight">
          Video Günlüğü{"\n"}Uygulamasına
        </Text>
        <Text className="text-5xl font-extrabold text-white tracking-tight">
          Hoş Geldin 📹
        </Text>

        <Text className="text-base text-gray-300 mt-4 w-11/12">
          Bir video seçerek kesmeye başlayabilirsin.
        </Text>

        <View className="mt-6 mb-6">
          <SearchBar onResultPress={(id) => router.push(`/videos/${id}`)} />
        </View>

        <View className="space-y-2">
          <LinkButton href="/videos" label="Tüm Videolarım" />
          <LinkButton
            href="/videos/favorites"
            label="Favori Videolarım"
            delay={100}
          />
        </View>
      </Animated.View>
      {latest && (
        <Animated.View
          entering={FadeInUp.duration(600).delay(300)}
          className=""
        >
          <Text className="text-lg font-semibold text-white">
            Son Eklenen Video
          </Text>

          <View className="relative overflow-hidden rounded-xl border border-gray-400/40">
            <Pressable
              onPress={() => router.push(`/videos/${latest.id}`)}
              className="absolute top-2 right-2 z-10 bg-black/60 rounded-full px-3 py-1"
              hitSlop={10}
            >
              <Text className="text-white text-sm">Videoya Git</Text>
            </Pressable>

            <Video
              source={{ uri: latest.uri }}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              style={{ height: 180 }}
            />

            <View className="p-3 bg-black/60">
              <Text className="text-white font-medium">{latest.name}</Text>
            </View>
          </View>
        </Animated.View>
      )}
      <Link href="/select-video" asChild>
        <AnimatedPressable
          style={btnStyle}
          onPressIn={() => (pressed.value = withTiming(1, { duration: 150 }))}
          onPressOut={() => (pressed.value = withTiming(0, { duration: 150 }))}
          className="px-8 py-3 rounded-3xl self-center mb-8"
          entering={FadeInUp.duration(700).delay(400)}
        >
          <Text
            className={`text-lg font-semibold ${
              pressed.value ? "text-gray-800" : "text-blue-300"
            }`}
          >
            Video Seçmeye Başla
          </Text>
        </AnimatedPressable>
      </Link>
    </Animated.View>
  );
}
