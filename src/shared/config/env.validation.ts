import { plainToClass, Transform } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
  @IsString()
  AWS_ACCESS_KEY_ID: string

  @IsString()
  AWS_SECRET_ACCESS_KEY: string

  @IsString()
  AWS_BUCKET_NAME: string

  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  ALLOWED_CONTENT_TYPE: string[]

  @IsString({ each: true })
  @Transform(({ value }) => value.split(','))
  ALLOWED_EXTENSIONS: string
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  )

  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) {
    throw new Error(errors.toString())
  }
  return validatedConfig
}
