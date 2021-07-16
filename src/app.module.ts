import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { AwsDomainModule } from './modules/aws/aws.domain-module'
import { UploaderDomainModule } from './modules/uploader/uploader.domain-module'
import { validate } from './shared/config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    AwsDomainModule,
    UploaderDomainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
