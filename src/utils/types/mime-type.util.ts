import { BadRequestException } from '@nestjs/common'
import * as mimeTypes from 'mime-types'

export interface GetFileMimeTypes {
  contentType: string
  extension: string
}

export const getFileMimeTypes = (fileMimetype: string): GetFileMimeTypes => {
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
