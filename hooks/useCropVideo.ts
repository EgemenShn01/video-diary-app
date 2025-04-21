import { useMutation } from '@tanstack/react-query';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

/**
 * Bu hook, video kırpma işlemini simüle eder.
 * Case gereği gerçek FFMPEG komutu aşağıda yazılmıştır ancak
 * Expo Go + iPhone kullanımı nedeniyle aktif değildir.
 * Native modül destekli ortamda FFmpegKit.execute(command) aktif hale getirilebilir.
 */

export const useCropVideo = () => {
  return useMutation({
    mutationFn: async ({ uri, start, end }: { uri: string; start: number; end: number }) => {
      // Gerçek kırpma komutu aşağıda (şimdilik kullanılmıyor)
      const outputPath = `${FileSystem.cacheDirectory}cropped_${Date.now()}.mp4`;
      const command = `-i "${uri}" -ss ${start} -t ${end - start} -c copy "${outputPath}"`;

      console.log('FFMPEG command prepared:', command);

      // ❗ Simülasyon: Gerçek FFMPEG çağrısı devre dışı
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return uri;

      //  Native ortamda şu şekilde aktif edilir:
      /*
      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();
      if (returnCode?.isValueSuccess()) {
        return outputPath;
      } else {
        throw new Error('FFMPEG kırpma işlemi başarısız');
      }
      */
    },
  });
};
