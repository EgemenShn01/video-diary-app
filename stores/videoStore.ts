import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type VideoItem = {
  id: string;
  uri: string;
  name: string;
  description: string;
  isFavorite?: boolean;
};

type VideoStore = {
  videos: VideoItem[];
  selectedVideo: string | null;
  cropStart: number;
  cropEnd: number;

  addVideo: (video: VideoItem) => void;
  updateVideo: (id: string, data: Partial<VideoItem>) => void;
  removeVideo: (id: string) => void;
  setSelectedVideo: (id: string | null) => void;
  setCropTimes: (start: number, end: number) => void;
  toggleFavorite: (id: string) => void;
};

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videos: [],
      selectedVideo: null,
      cropStart: 0,
      cropEnd: 5,

      addVideo: (video) =>
        set((state) => ({ videos: [...state.videos, video] })),

      updateVideo: (id, data) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === id ? { ...video, ...data } : video
          ),
        })),

      removeVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id),
        })),

      setSelectedVideo: (id) => set({ selectedVideo: id }),

      setCropTimes: (start, end) => set({ cropStart: start, cropEnd: end }),

      toggleFavorite: (id) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === id
              ? { ...video, isFavorite: !video.isFavorite }
              : video
          ),
        })),
    }),
    {
      name: 'video-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ videos: state.videos }),
    }
  )
);
