import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Express } from 'express'
import * as mimeTypes from 'mime-types'
import { S3Domain } from './modules/aws/s3/s3.domain'
import { resizeImage } from './utils/image/resize-image.util'
import { isImageType } from './utils/types/is-image.util'

interface GetFileMimeTypes {
  contentType: string
  extension: string
}

@Injectable()
export class AppService {
  constructor(
    private s3Domain: S3Domain,
    private configService: ConfigService,
  ) {}

  async upload(file: Express.Multer.File, originalName: string): Promise<void> {
    const { extension, contentType } = this.getFileMimeTypes(file.mimetype)

    this.throwErrorIfNotAllowedFileMime(extension, contentType)

    const isImage = isImageType(extension)
    if (isImage) {
      return this.uploadImagesInSeveralSizes(
        file.buffer,
        originalName,
        extension,
        contentType,
      )
    }
    return this.s3Domain.uploadFile({
      fileName: `${originalName}.${extension}`,
      file: file.buffer,
      contentType,
    })
  }

  throwErrorIfNotAllowedFileMime(extension: string, contentType: string): void {
    const allowedContentType = this.configService.get<string[]>('ALLOWED_CONTENT_TYPE')

    const allowedExtensions = this.configService.get<string[]>('ALLOWED_EXTENSIONS')

    const isExtensionInWhiteList = allowedExtensions.some(it => it === extension)
    const isContentTypeInWhiteList = allowedContentType.some(it => it === contentType)

    if (!isExtensionInWhiteList || !isContentTypeInWhiteList) {
      throw new BadRequestException('File mime is not allowed')
    }
  }

  getFileMimeTypes(fileMimetype: string): GetFileMimeTypes {
    const extension = mimeTypes.extension(fileMimetype)
    const contentType = mimeTypes.contentType(fileMimetype)
    if (!extension || !contentType) {
      throw new BadRequestException('Can not get file mime types')
    }
    return {
      extension,
      contentType,
    }
  }

  async uploadImagesInSeveralSizes(
    file: Buffer,
    originalName: string,
    extension: string,
    contentType: string,
  ): Promise<void> {
    const resizedImages = await resizeImage(file, [
      [2048, 2048],
      [1024, 1024],
      [300, 300],
    ])

    const filesToUpload = resizedImages.map((image) => ({
      fileName: `${originalName}_${image.sizePrefix}.${extension}`,
      file: image.buffer,
      contentType,
    }))

    await this.s3Domain.uploadFile(filesToUpload)
  }
}
