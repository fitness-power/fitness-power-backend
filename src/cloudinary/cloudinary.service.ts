import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async upload_image(buffer: Buffer, folder: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `portfolio/${folder}`,
            format: 'png',
            transformation: [{ width: 1000, height: 1000 }],
          },
          (error, result) => {
            if (error) reject(error.message);
            return resolve(result.secure_url);
          },
        )
        .end(buffer);
    });
  }

  async delete_image(image: string) {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(image, (error) => {
        if (error) reject(error.message);
        resolve('Image deleted');
      });
    });
  }

  async replaceImage(
    publicId: string,
    folder: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: publicId,
            folder: `portfolio/${folder}`,
            format: 'png',
            overwrite: true,
            transformation: [{ width: 1000, height: 1000 }],
          },
          (error, result) => {
            if (error) {
              reject(error.message);
            } else {
              resolve(result?.secure_url);
            }
          },
        )
        .end(fileBuffer);
    });
  }
}
