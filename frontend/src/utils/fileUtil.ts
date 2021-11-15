export function extractFileExt(fileName: string): string {
    const lastDotPos = fileName.lastIndexOf('.')
    return fileName.slice(lastDotPos)
}
