import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

type FilePathConfig = {
  first?: string
  last?: string
  monorepo?: string
}

function getFilePathURL(url: string, config: FilePathConfig) {
  const { first, last, monorepo } = config
  if (existsSync(`${monorepo}${url}`)) {
    return new URL(url, pathToFileURL(monorepo))
  }
  if (existsSync(`${first}${url}`)) {
    return new URL(url, pathToFileURL(first))
  }
  if (existsSync(`${last}${url}`)) {
    return new URL(url, pathToFileURL(last))
  }
  return null
}

export function importFileUrlGetter(scssFilePath: string, projectPath: string | undefined) {
  return (url: string) => {
    const key = '/node_modules/'
    const first = scssFilePath.substring(0, scssFilePath.indexOf(key) + key.length)
    const last = scssFilePath.substring(0, scssFilePath.lastIndexOf(key) + key.length)
    const monorepo = `${projectPath}${key}`
    if (url.startsWith('~@semi-bot') || url.includes('@semi-ui') || url.includes('@semi-icons')) {
      return getFilePathURL(url.substring(1), { first, last, monorepo })
    } else if (url.startsWith('~')) {
      return getFilePathURL(url.substring(1), { last, monorepo })
    }

    const filePath = resolve(dirname(scssFilePath), url)
    if (existsSync(filePath)) {
      return pathToFileURL(filePath)
    }
    return null
  }
}
