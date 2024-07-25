/* eslint-disable unused-imports/no-unused-vars */
import fs from 'node:fs'

import type { SemiPluginOption, SemiThemeOptions } from '..'

import { convertMapToString } from '.'

type FileLoaderOptions = SemiThemeOptions & SemiPluginOption

export async function semiThemeLoader(path: string, options: FileLoaderOptions): Promise<string> {
  const file = fs.readFileSync(path)
  const source = file.toString('utf-8')
  const theme = options?.name || '@douyinfe/semi-theme-default'
  // always inject
  const scssVarStr = `@import "~${theme}/scss/index.scss";\n`
  // inject once
  const cssVarStr = `@import "~${theme}/scss/global.scss";\n`

  let animationStr = `@import "~${theme}/scss/animation.scss";\n`

  try {
    await import.meta.resolve(`${theme}/scss/animation.scss`)
  } catch (e) {
    console.log(`${theme}/scss/animation.scss not found`)
    animationStr = '' // fallback to empty string
  }
  const shouldInject = source.includes('semi-base')

  let fileStr = source

  let componentVariables: string | boolean
  try {
    componentVariables = await import.meta.resolve(`${theme}/scss/local.scss`)
  } catch (error) {
    console.log(`cannot resolve file ${theme}/scss/local.scss`)
  }
  const variables = convertMapToString(options.variables)

  if (options.include || variables || componentVariables) {
    let localImport = ''
    if (componentVariables) {
      localImport += `\n@import "~${theme}/scss/local.scss";`
    }
    if (options.include) {
      localImport += `\n@import "${options.include}";`
    }
    if (options.variables) {
      localImport += `\n${options.variables}`
    }

    try {
      const regex = /(@import '.\/variables.scss';?|@import ".\/variables.scss";?)/g
      const fileSplit = source.split(regex).filter(Boolean)
      if (fileSplit.length > 1) {
        fileSplit.splice(fileSplit.length - 1, 0, localImport)
        fileStr = fileSplit.join('')
      }
    } catch (error) {
      console.error(error)
    }
  }

  // inject prefix
  const prefixCls = options.prefixCls || 'semi'

  const prefixClsStr = `$prefix: '${prefixCls}';\n`

  let finalCSS: string = ''
  if (shouldInject) {
    finalCSS = `${animationStr}${cssVarStr}${scssVarStr}${prefixClsStr}${fileStr}`
  } else {
    finalCSS = `${scssVarStr}${prefixClsStr}${fileStr}`
  }
  return finalCSS
}
