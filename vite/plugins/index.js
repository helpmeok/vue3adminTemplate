import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
// import legacy from "@vitejs/plugin-legacy" //es6转es5，兼容低版本浏览器，但是打包后文件体积变大。

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()]
  // vitePlugins.push(legacy())
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}
