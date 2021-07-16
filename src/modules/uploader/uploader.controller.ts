import { Controller, Get, Param, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'
import { UploaderDomain } from './uploader.domain'

@Controller()
export class UploaderController {
  constructor(private readonly appService: UploaderDomain) {}

  @Get(':filename')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Param('filename') filename: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.appService.upload(file, filename)
  }
}
