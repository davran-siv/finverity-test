import * as sharp from 'sharp'
import { isArray } from '../types/variable-type.util'

export type ImageSize = [number, number]

export interface ResizedImage {
  buffer: Buffer
  sizePrefix: string
}

export async function resizeImage(buffer: Buffer, size: ImageSize): Promise<ResizedImage>
export async function resizeImage(buffer: Buffer, size: ImageSize[]): Promise<ResizedImage[]>
export async function resizeImage(buffer: Buffer, size: ImageSize | ImageSize[]): Promise<ResizedImage | ResizedImage[]> {
  if (isArray(size)) {
    return Promise.all(size.map((it) => resizeImageUtil(buffer, it)))
  }
  return resizeImage(buffer, size)
}

const resizeImageUtil = async (
  buffer: Buffer,
  [width, height]: ImageSize,
): Promise<ResizedImage> => {
  return {
    buffer: await sharp(buffer).resize(width, height).jpeg().toBuffer(),
    sizePrefix: `${width}x${height}`,
  }
}
