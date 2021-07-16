import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { fileFilter } from '../../shared/filters/file.filter'
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
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        limits: {
          fileSize: configService.get<number>('MAX_FILE_SIZE'),
        },
        fileFilter: fileFilter({
          allowedFileExtensions: configService.get<string[]>('ALLOWED_EXTENSIONS'),
          allowedContentTypes: configService.get<string[]>('ALLOWED_CONTENT_TYPE'),
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    UploaderDomain,
  ],
  exports: [],
})
export class UploaderDomainModule {}
