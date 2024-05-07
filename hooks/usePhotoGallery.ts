import { useState, useEffect, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  type ResizeImage = (url: string, maxWidth: number, maxHeight: number) => Promise<string>;


  const takePhoto = async () => {
    if (Capacitor.isNativePlatform()) {
      const cameraPermission = await Camera.checkPermissions();
      
      // Check if the camera permission is not granted
      if (cameraPermission.camera !== 'granted') {
        const requestedPermission = await Camera.requestPermissions();
        
        // Re-check if permissions have been granted after requesting
        if (requestedPermission.camera !== 'granted') {
          throw new Error('Camera permission not granted');
        }
      }
    }
  
    try {
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
      console.log(error)
      throw error;
    }
  };


  const savePicture = async (photo: Photo) => {
    try {
      const base64Data = await base64FromPath(photo.webPath!);
      const fileName = new Date().getTime() + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    } catch (error) {
      console.log(error)
      throw error;
    }
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

  const resizeImage: ResizeImage = (url, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
  
        // Calculate the new dimensions based on aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }
  
        // Resize the image using Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          resolve(dataUrl);
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  };
  

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
  type GetPhotoAsBase64 = (photoUri: string) => Promise<string>;
  const getPhotoAsBase64: GetPhotoAsBase64 = async (photoUri) => {
    try {
      const resizedDataUrl: string = await resizeImage(photoUri, 800, 600);  // Resize to max 800x600 pixels
      const base64Data = resizedDataUrl.split(',')[1];  // Remove the data URL part
      return base64Data;
    } catch (error) {
      console.error('Error resizing and encoding image:', error);
      throw error;
    }
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
