import { useState, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const takePhoto = async () => {
    // Request camera permissions
    if (Capacitor.isNativePlatform()) {
      const cameraPermission = await Camera.checkPermissions();
      if (cameraPermission.camera !== 'granted') {
        await Camera.requestPermissions();
        throw new Error('Camera permission not granted');
      }
    }

    try {
      // Now, camera permission is granted, proceed to take photo
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      const savedImageFile = await savePicture(photo);
      const newPhotos = [...photos, savedImageFile];
      setPhotos(newPhotos);
      return savedImageFile;
    } catch (error) {
      console.error('Error taking photo:', error);
      // Handle error appropriately
    }
  };

  const savePicture = async (photo: Photo) => {
    const base64Data = await base64FromPath(photo.webPath!);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });
    return {
      filepath: fileName,
      webviewPath: photo.webPath, // This should now be a correct URL
    };
  };

  const loadSaved = useCallback(async () => {
    try {
      const fileList = await Filesystem.readdir({
        directory: Directory.Data,
        path: '',
      });
      const photos = await Promise.all(
        fileList.files.map(async FileInfo => {
          const readFileResult = await Filesystem.readFile({
            path: FileInfo.name,
            directory: Directory.Data,
          });
          const blob = b64toBlob(readFileResult.data.toString(), 'image/jpeg');

          // Create a blob URL for the image
          const webviewPath = URL.createObjectURL(blob);
          const photo: UserPhoto = {
            filepath: FileInfo.name,
            webviewPath: webviewPath,
          };
          return photo;
        }),
      );

      return photos;
    } catch (error) {
      console.error('Error loading saved photos:', error);
      return [];
    }
  }, []);

  function b64toBlob(
    b64Data: string,
    contentType = 'image/jpeg',
    sliceSize = 512,
  ) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  const base64FromPath = async (path: string) => {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const getPhotoAsBase64 = async (photoUri: string) => {
    const response = await fetch(photoUri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        let base64Data = reader.result as string;
        resolve(base64Data.split(',')[1]); // Remove the data URL part
      };
      reader.readAsDataURL(blob);
    });
  };
  useEffect(() => {
    (async () => setPhotos(await loadSaved()))();
  }, [loadSaved]);

  return {
    photos,
    takePhoto,
    savePicture,
    loadSaved,
    getPhotoAsBase64,
  };
}
