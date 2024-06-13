import os from 'node:os'
import path from 'node:path'

export function normalizePath(id: string) {
  return path.posix.normalize(os.platform() === 'win32' ? id.replace(/\\/g, '/') : id)
}

// copy from https://github.com/DouyinFE/semi-design/blob/main/packages/semi-webpack/src/semi-webpack-plugin.ts#L136
export function convertMapToString(map: Record<string, string | number>) {
  if (!map) return ''
  return Object.keys(map).reduce((prev, curr) => {
    return `${prev}${curr}: ${map[curr]};\n`
  }, '')
}

export * from './importFileUrlGetter'
export * from './semiThemeLoader'
