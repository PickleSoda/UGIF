import { useState, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Media } from '@capacitor-community/media';
import { Capacitor } from '@capacitor/core';
interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}
type ResizeImage = (url: string, maxWidth: number, maxHeight: number) => Promise<string>;

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

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
      console.log(error);
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
      console.log(error);
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

  async function downloadAndSaveFile(url: string, fileName: string) {
    try {
      // Fetch the file as a blob
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blob = await response.blob();

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      await new Promise(resolve => {
        reader.onloadend = resolve;
      });

      // Save the file using Filesystem API
      if (reader.result) {
        const base64Data = reader.result.toString().split(',')[1];
        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Data,
        });

        console.log('File downloaded to:', savedFile.uri);
        return savedFile.uri;
      }
      return null;
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }

  const ensureAlbumExists = async (album: string = 'You Gifs') => {
    const { albums } = await Media.getAlbums();
    let demoAlbum = undefined;
    if (Capacitor.getPlatform() === 'android') {
      const albumsPath = (await Media.getAlbumsPath()).path;
      demoAlbum = albums.find(
        a => a.name === album && a.identifier.startsWith(albumsPath),
      );
      console.log(demoAlbum);
    } else {
      demoAlbum = albums.find(a => a.name === album);
    }

    if (!demoAlbum) {
      demoAlbum = await Media.createAlbum({ name: album });
      console.log(
        `Demo album does not exist; create it first using the "Create Demo Album" button above.`,
      );
    }

    return demoAlbum?.identifier;
  };

  const saveToMedia = async (url: string, fileName: string) => {
    try {
      // Extract the file extension from the URL
      const urlParts = url.split('.');
      const extension = urlParts[urlParts.length - 1];

      // Check if fileName already ends with the extracted extension, if not, append it
      if (!fileName.endsWith(extension)) {
        fileName += '.' + extension;
      }

      const albumIdentifier = await ensureAlbumExists();
      let opts = {
        path: url,
        albumIdentifier: albumIdentifier,
        fileName: fileName,
      };

      const savedMedia = await Media.savePhoto(opts);
      console.log('Media saved:', savedMedia);
      return savedMedia;
    } catch (error) {
      console.error('Error saving media:', error);
      return null;
    }
  };

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
          reject(new Error('Failed to get canvas context'));
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
  const getPhotoAsBase64: GetPhotoAsBase64 = async photoUri => {
    try {
      const resizedDataUrl: string = await resizeImage(photoUri, 800, 600); // Resize to max 800x600 pixels
      const base64Data = resizedDataUrl.split(',')[1]; // Remove the data URL part
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
    downloadAndSaveFile,
    saveToMedia,
  };
}
