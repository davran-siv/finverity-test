import { Express } from 'express'
import { getFileMimeTypes } from '../../utils/types/mime-type.util'

interface FileFilter {
  allowedContentTypes: string[]
  allowedFileExtensions: string[]
}

export const fileFilter = (whiteList: FileFilter) => (req, file: Express.Multer.File, callback) => {
  const { extension, contentType } = getFileMimeTypes(file.mimetype)

  const isExtensionInWhiteList = whiteList.allowedFileExtensions.some(it => it === extension)

  const isContentTypeInWhiteList = whiteList.allowedContentTypes.some(it => it === contentType)

  !isExtensionInWhiteList || !isContentTypeInWhiteList
    ? callback(new Error('File mime is not allowed'), false)
    : callback(null, true)
}
