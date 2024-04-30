import { useState, useEffect } from 'react';
import { isPlatform } from '@ionic/react';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedImageFile = await savePicture(photo);
    const newPhotos = [...photos, savedImageFile];
    setPhotos(newPhotos);
    return savedImageFile;
  };

  const savePicture = async (photo: Photo) => {
    const base64Data = await base64FromPath(photo.webPath!);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Use webPath to display the new image instead of base64 preview
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };

  const loadSaved = async () => {
    const photoList = await Preferences.get({ key: 'photos' });
    const photos = photoList.value
      ? (JSON.parse(photoList.value) as UserPhoto[])
      : [];

    for (let photo of photos) {
      const readFileResult = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

      // Use convertFileSrc to adjust the path for native platforms
      if (isPlatform('hybrid')) {
        // convertFileSrc requires the full file path to the saved file.
        // Assuming photo.filepath contains the full path from the root.
        photo.webviewPath = Capacitor.convertFileSrc(photo.filepath);
      } else {
        // For the web platform, assuming readFileResult.data is base64 since no encoding is specified.
        photo.webviewPath = `data:image/jpeg;base64,${readFileResult.data}`;
      }
    }
    setPhotos(photos);
  };

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
    loadSaved();
  }, []);

  return {
    photos,
    takePhoto,
    savePicture,
    loadSaved,
    getPhotoAsBase64,
  };
}
