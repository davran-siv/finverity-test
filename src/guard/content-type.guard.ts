import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ContentTypeGuard implements CanActivate {
  constructor(
    private config: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const contentType = request.headers['content-type']
    const allowedContentType = this.config
      .get<string>('ALLOWED_CONTENT_TYPE')
      .split(',')

    if (allowedContentType.some((it) => it === contentType)) {
      return true
    }
    throw new BadRequestException('Not allowed content type')
  }
}
