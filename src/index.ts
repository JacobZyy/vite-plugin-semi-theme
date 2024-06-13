import type { PluginOption } from 'vite'
import { normalizePath, semiThemeLoader, importFileUrlGetter } from './utils'
import { compileString, Logger } from 'sass'

export type SemiPluginOption = {
  prefixCls?: string
  variables?: Record<string, string | number>
  include?: string
}
export type SemiPluginConfig = {
  theme: string
  options?: SemiPluginOption
}

export interface SemiThemeOptions {
  name?: string
}

/**
 * @note 二开阅读理解迁移
 * @note 阅读 webpack 版本代码的理解
 * 1. 解析 css 到对应 scss
 * 2. 替换 scss 内容
 * 3. 再构建成对应的 css
 */

export default function semiPlugin({ theme, options = {} }: SemiPluginConfig): PluginOption {
  return {
    name: 'semi-theme-loader',
    enforce: 'post',
    load: async (id) => {
      const filePath = normalizePath(id)
      if (!!options.include) {
        options.include = normalizePath(options.include)
      }

      /**
       * @see https://github.com/DouyinFE/semi-design/blob/main/packages/semi-webpack/src/semi-webpack-plugin.ts#L83
       */
      const shouldLoad = /@douyinfe\/semi-(ui|icons|foundation)\/lib\/.+\.css$/.test(filePath)
      if (!shouldLoad) return null
      const scssFilePath = filePath.replace(/\.css$/, '.scss')

      /**
       * @see https://github.com/DouyinFE/semi-design/blob/04d17a72846dfb5452801a556b6e01f9b0e8eb9d/packages/semi-webpack/src/semi-webpack-plugin.ts#L23
       */
      const semiSemiLoaderOptions: SemiThemeOptions = { name: theme }

      const loaderResult = await semiThemeLoader(scssFilePath, {
        ...semiSemiLoaderOptions,
        ...options
      })

      const compileCSSResult = compileString(loaderResult, {
        importers: [
          {
            findFileUrl: importFileUrlGetter(scssFilePath)
          }
        ],
        logger: Logger.silent
      })

      return compileCSSResult.css
    }
  }
}
