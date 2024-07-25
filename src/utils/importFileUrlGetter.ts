import nodeUrl from 'node:url'
import path from 'node:path'

import fs from 'node:fs'

export function importFileUrlGetter(scssFilePath: string, projectPath: string | undefined) {
  return (url: string) => {
    const key = '/node_modules/'
    if (projectPath) {
      return new URL(url.substring(1), `${projectPath}${key}`)
    }
    if (url.startsWith('~@semi-bot')) {
      return new URL(url.substring(1), nodeUrl.pathToFileURL(scssFilePath.substring(0, scssFilePath.indexOf(key) + key.length)))
    } else if (url.startsWith('~')) {
      return new URL(url.substring(1), nodeUrl.pathToFileURL(scssFilePath.substring(0, scssFilePath.lastIndexOf(key) + key.length)))
    }

    const filePath = path.resolve(path.dirname(scssFilePath), url)
    if (fs.existsSync(filePath)) {
      return nodeUrl.pathToFileURL(filePath)
    }
    return null
  }
}
