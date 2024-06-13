# @jacob-z/vite-plugin-semi-theme-loader

## forked from: [vite-plugin-semi-theme](https://github.com/boenfu/vite-plugin-semi-theme.git)

## Change Log

- 源码ts重写
- 修复pnpm管理时无法正确导入主题包的scss的问题 （思路来源 [#5](https://github.com/boenfu/vite-plugin-semi-theme/issues/5#issuecomment-1278757844) )
- 修复上述issue中无法正确导入组件token变量的问题

- 原仓库取材于 [theme options docs](https://github.com/DouyinFE/semi-design/tree/main/packages/semi-webpack#api)

## Usage

```js
// vite.config.js
import { defineConfig } from "vite";
import semi from "@jacob-z/vite-plugin-semi-theme-loader";

export default defineConfig({
  plugins: [
    semi({
      theme: "@semi-bot/semi-theme-yours",
      // options: {
      // ... 👆
      //},
    }),
  ],
});
```

