import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { S3Domain } from './s3/s3.domain'

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    S3Domain,
  ],
  exports: [AwsDomainModule, S3Domain],
})
export class AwsDomainModule {}
