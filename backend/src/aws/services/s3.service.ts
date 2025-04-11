import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../config/aws.config';

@Injectable()
export class S3Service {
  private readonly bucketName = process.env.AWS_S3_BUCKET;

  private generateKey(originalName: string, userId: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    return `users/${userId}/${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
  }

  async uploadFile(file: Express.Multer.File, userId: string): Promise<{ key: string; url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const key = this.generateKey(file.originalname, userId);
    
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
        },
      });

      await s3Client.send(command);
      
      // Get a signed URL for immediate access
      const url = await this.getSignedUrl(key);
      
      return { key, url };
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      throw new BadRequestException(`Failed to generate signed URL: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }
} 