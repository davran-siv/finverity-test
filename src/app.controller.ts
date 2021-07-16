import { Controller, Get, Param, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':filename')
  @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(ContentTypeGuard)
  uploadFile(
    @Param('filename') filename: string,
    @UploadedFile() file: Express.Multer.File,
  ): any {
    return this.appService.upload(file, filename)
  }
}
