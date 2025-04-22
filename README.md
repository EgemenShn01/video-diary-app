Video Diary App

**Açıklama**
Video Diary App, Expo tabanlı React Native ile geliştirilmiş, kullanıcıların cihazlarından video seçip 5 saniyelik kesitini kırpmasına, kırpılan kliplere isim ve açıklama eklemesine, ardından bu videoları listeleyip detay sayfasında izleyip düzenlemesine olanak tanıyan bir mobil uygulamadır.

---

## 🚀 Özellikler

- **Video Seçme:** Cihaz galerisinden video seçimi (expo-image-picker).
- **Video Kırpma:** FFmpegKit ile 5 saniyelik kesit kırpma, Tanstack Query ile asenkron iş yönetimi.
- **Meta Veri Ekleme:** Zod ile form doğrulaması, kullanıcı tanımlı isim ve açıklama.
- **Kayıtlı Videolar:** Zustand + AsyncStorage (persist) ile uygulama yeniden başlatıldığında verilerin saklanması.
- **Listeleme & Detay:** Kayıtlı videoların listelenmesi, detay/değiştirme/silme sayfası.
- **Navigasyon:** Expo Router.
- **Stil:** NativeWind (TailwindCSS benzeri sınıflar), global arka plan görseli.
- **Animasyonlar:** React Native Reanimated ile Fade-in, puls ve hover efektleri.

---

## 📦 Teknolojiler

- **Core:** Expo, React Native, Expo Router
- **State Management:** Zustand, AsyncStorage
- **Asenkron İşlemler:** @tanstack/react-query
- **Video İşleme:** ffmpeg-kit-react-native, expo-av
- **Form Doğrulama:** Zod
- **Stil:** NativeWind, TailwindCSS
- **Animasyon:** React Native Reanimated
- **Ek Paketler:** expo-image-picker, @react-native-community/slider

---


1. Depoyu klonlayın:
   git clone <repo-url>
   cd video-diary-app
2. Bağımlılıkları yükleyin:
   npx expo install
   npm install
3. Çalıştırın:
   npm start        # Metro bundler
   npm run android  # Android emülatör veya cihaz
   npm run ios      # iOS simülatöre başlatır (macOS)
   npm run web      # Web versiyon


## 🧩 Komutlar

| Komut         | Açıklama                             |
|---------------|--------------------------------------|
| npm start     | Metro bundler başlatır               |
| npm run android | Android cihaz/simülatöre başlatır |
| npm run ios   | iOS simülatöre başlatır (macOS)      |
| npm run web   | Web versiyon                         |
| npm test      | Jest ile testleri çalıştırır         |
| npm run lint  | Kod linter                           |

---

