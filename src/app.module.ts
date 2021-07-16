import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AwsDomainModule } from './modules/aws/aws.domain-module'
import { validate } from './shared/config/env.validation'

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    AwsDomainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
