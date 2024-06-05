import { Filesystem, Directory, WriteFileResult } from '@capacitor/filesystem';

export interface ImageCacheResult {
  data?: string;
  from?: 'cache' | 'network';
}

export class CapImageCacheService {
  private static cachePath: string = 'CACHE_IMAGES';

  public static async getImageSrc(url: string): Promise<ImageCacheResult> {
    const newUrl = new URL(url);
    const imageName = newUrl.pathname.split('/').pop();
    const imageType = (imageName || url).split('.').pop();

    try {
      const readFile = await Filesystem.readFile({
        directory: Directory.Cache,
        path: `${this.cachePath}/${imageName}`,
      });
      return {
        data: `data:image/${imageType};base64,${readFile.data}`,
        from: 'cache',
      };
    } catch (e) {
      try {
        await this.storeImage(url, imageName || url);
        const readFile = await Filesystem.readFile({
          directory: Directory.Cache,
          path: `${this.cachePath}/${imageName}`,
        });
        return {
          data: `data:image/${imageType};base64,${readFile.data}`,
          from: 'network',
        };
      } catch (error) {
        throw new Error("There's a network error");
      }
    }
  }

  private static async storeImage(url: string, path: string): Promise<WriteFileResult | unknown> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      if (blob.type === 'text/html') {
        console.error('Response was not an image');
        throw new Error('There was an error while loading an image');
      }
      const base64Data = await this.convertBlobToBase64(blob);
      const savedFile = await Filesystem.writeFile({
        directory: Directory.Cache,
        data: base64Data,
        path: `${this.cachePath}/${path}`,
        recursive: true,
      });
      return savedFile;
    } catch (error: unknown) {
      throw new Error("There's a network error");
    }
  }

  private static convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject('Error #F00');
        }
      };
      reader.readAsDataURL(blob);
    });
  }
}
