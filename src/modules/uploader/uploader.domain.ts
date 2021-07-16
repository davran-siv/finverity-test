import { Injectable } from '@nestjs/common'
import { Express } from 'express'
import { resizeImage } from '../../utils/image/resize-image.util'
import { isImageType } from '../../utils/types/is-image.util'
import { getFileMimeTypes } from '../../utils/types/mime-type.util'
import { S3Domain } from '../aws/s3/s3.domain'

@Injectable()
export class UploaderDomain {
  constructor(
    private s3Domain: S3Domain,
  ) {}

  async upload(file: Express.Multer.File, originalName: string): Promise<void> {
    const { extension, contentType } = getFileMimeTypes(file.mimetype)

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
