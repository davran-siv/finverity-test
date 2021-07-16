export interface S3UploadFileRequest {
  file: Buffer
  fileName: string
  contentType: string
}

export interface S3UploadOneFileRequest extends S3UploadFileRequest{
  bucket: string
}
