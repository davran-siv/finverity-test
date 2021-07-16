export const isImageType = (fileType: string): boolean => {
  const imageTypes = ['gif', 'jpeg', 'png', 'svg']
  return imageTypes.some((imageType) => imageType === fileType)
}
