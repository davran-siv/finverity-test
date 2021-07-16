import { Controller, Get, Param, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { UploaderDomain } from './uploader.domain'

@Controller()
export class UploaderController {
  constructor(private readonly appService: UploaderDomain) {}

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
