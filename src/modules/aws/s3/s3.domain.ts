import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3 } from 'aws-sdk'
import { isArray } from '../../../utils/types/variable-type.util'
import { S3UploadFileRequest, S3UploadOneFileRequest } from './s3.interfaces'

@Injectable()
export class S3Domain {
  private S3Instance: S3

  constructor(
    private configService: ConfigService,
  ) {
    this.S3Instance = this.getS3Instance()
  }

  async uploadFile(props: S3UploadFileRequest): Promise<void>
  async uploadFile(props: S3UploadFileRequest[]): Promise<void>
  async uploadFile(
    props: S3UploadFileRequest | S3UploadFileRequest[],
  ): Promise<void> {
    const bucket = this.configService.get('AWS_BUCKET_NAME')
    if (isArray(props)) {
      await Promise.all(
        props.map(async (it) => this.uploadOneFile({ ...it, bucket })),
      )
      return
    }
    await this.uploadOneFile({ ...props, bucket })
  }

  private async uploadOneFile(props: S3UploadOneFileRequest): Promise<void> {
    const params = {
      Bucket: props.bucket,
      Key: props.fileName,
      Body: props.file,
      ContentType: props.contentType,
    }
    await this.S3Instance.upload(params).promise()
  }

  private getS3Instance(): S3 {
    return new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    })
  }
}
