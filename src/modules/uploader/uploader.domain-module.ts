import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AwsDomainModule } from '../aws/aws.domain-module'
import { UploaderController } from './uploader.controller'
import { UploaderDomain } from './uploader.domain'

@Module({
  controllers: [
    UploaderController,
  ],
  imports: [
    AwsDomainModule,
    ConfigModule,
  ],
  providers: [
    UploaderDomain,
  ],
  exports: [],
})
export class UploaderDomainModule {}
