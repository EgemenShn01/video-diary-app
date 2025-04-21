
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet } from "react-native";
import "react-native-reanimated";
import '../global.css';
import bgDark from "@/assets/bg-video-dark.png"; 

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ImageBackground
        source={bgDark}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
      >
        <ImageBackground
          source={undefined}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: "#0009" }]}
        >
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </ImageBackground>
      </ImageBackground>

      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
