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
import { Preferences } from '@capacitor/preferences';
interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}
type ResizeImage = (
  url: string,
  maxWidth: number,
  maxHeight: number,
) => Promise<string>;
const PHOTO_STORAGE = 'photos';
export function usePhotoGallery() {

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
      console.log('Photo taken:', photo);
      const base64Data = await getPhotoAsBase64(photo.webPath!);
      console.log('Base64:', base64Data);
      return {photo,base64Data};
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const savePicture = async (photo: Photo) => {
    const base64Data = await getPhotoAsBase64(photo.webPath!);
    const fileName = 'photos/'+new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
      recursive: true,
    });
    console.log('Saved file:', savedFile);
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  }


  const loadSavedFolder = useCallback(async (pathName: string = '') => {
    try {
      const fileList = await Filesystem.readdir({
        directory: Directory.Data,
        path: pathName,
      });
      console.log('Files:', fileList);
      const Files = await Promise.all(
        fileList.files.map(async FileInfo => {
          const readFileResult = await Filesystem.readFile({
            path: pathName +'/'+ FileInfo.name,
            directory: Directory.Data,
          });
          const blob = getBase64AsBlob(readFileResult.data.toString(), 'image/jpeg');
          console.log('blob', blob, FileInfo);
          const webviewPath = URL.createObjectURL(blob);
          const photo: UserPhoto = {
            filepath: FileInfo.name,
            webviewPath: webviewPath,
          };
          return photo;
        }),
      );

      return Files;
    } catch (error) {
      console.error('Error loading saved photos:', error);
      return [];
    }
  }, []);

  async function downloadAndSaveFile(url: string, fileName: string) {
      console.log('Downloading file:', url);
      // Fetch the file as a blob
      const response = await fetch(url,{ mode: 'no-cors'});
      console.error(`response: ${response}`);

      const blob = await response.blob();
      console.log('Blob:', blob);

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      await new Promise(resolve => {
        reader.onloadend = resolve;
      });
      console.log('File downloaded:', reader.result);

      // Save the file using Filesystem API
      if (reader.result) {
        const base64Data = reader.result.toString().split(',')[1];
        saveBase64AsFile(base64Data, fileName);

      console.log('File downloaded');
    }
  }

  async function saveBase64AsFile(base64Data: string, fileName: string) {
    console.log('Saving file:', fileName);
    // Save the file using Filesystem API
    if (base64Data) {
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });
      console.log('File saved:', savedFile);
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
      throw error;
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

  function getBase64AsBlob(b64Data: string, contentType = '', sliceSize = 512) {
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
  // const getUserPhotos = async () => {
  //   const photos = await loadSavedFolder('photos');

  //   return photos.map(async photo => {
  //     const blob = getBase64AsBlob(photo.data.toString(), 'image/jpeg');
  //     return {
  //       filepath: photo.path,
  //       webviewPath: `data:image/jpeg;base64,${file.data}`,
  //     };
  //   });
  // }

  return {
    takePhoto,
    loadSavedFolder,
    getPhotoAsBase64,
    downloadAndSaveFile,
    saveToMedia,
    saveBase64AsFile,
    savePicture,
  };
}
