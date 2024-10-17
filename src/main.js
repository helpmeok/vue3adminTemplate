import { createApp } from 'vue'

import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

import '@/assets/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive

// 注册指令
import plugins from './plugins' // plugins
import { download, exportFileDown } from '@/utils/request'
// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'
import elementIcons from '@/components/SvgIcon/svgicon'
// json展示组件
import JsonViewer from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css"; // 引入样式
// 引入mitt
import mitt from 'mitt'
// 调用mitt得到emitter，emitter能：绑定事件、触发事件
const emitter = mitt()
import './permission' // permission control
// 时间插件
import moment from 'moment';
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn') //中文化
import { useDict } from '@/utils/dict'
import { useEnum } from '@/utils/enum'
import { parseTime, resetForm, addDateRange, setFormData, handleTree, selectDictLabel, selectDictLabels, setDictValNum, creatFileName } from '@/utils/ruoyi'
// 弹框组件
import BaseDialog from "@/components/BaseDialog";
// 表单组件
import BaseForm from "@/components/BaseForm";
// 表格组件
import BaseTable from "@/components/BaseTable";
// 表格搜索组件
import BaseTableSearch from "@/components/BaseTableSearch";
// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 自定义树选择组件
import TreeSelect from '@/components/TreeSelect'
// 字典标签组件
import DictTag from '@/components/DictTag'
const app = createApp(App)

// 全局组件挂载
app.component('moment', moment)
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('TreeSelect', TreeSelect)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component('Editor', Editor)
app.component('BaseDialog', BaseDialog)
app.component('BaseForm', BaseForm)
app.component('BaseTable', BaseTable)
app.component('BaseTableSearch', BaseTableSearch)

// 全局方法挂载(官方不推荐)
app.config.globalProperties.moment = moment
app.config.globalProperties.useDict = useDict
app.config.globalProperties.useEnum = useEnum
app.config.globalProperties.download = download
app.config.globalProperties.exportFileDown = exportFileDown
app.config.globalProperties.creatFileName = creatFileName
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.setFormData = setFormData
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels
app.config.globalProperties.setDictValNum = setDictValNum
app.config.globalProperties.emitter = emitter

// 使用provide挂载全局(官方推荐)
app.provide('useDict', useDict);
app.provide('useEnum', useEnum);
app.provide('download', download);
app.provide('exportFileDown', exportFileDown);
app.provide('creatFileName', creatFileName);
app.provide('parseTime', parseTime);
app.provide('resetForm', resetForm);
app.provide('handleTree', handleTree);
app.provide('addDateRange', addDateRange);
app.provide('setFormData', setFormData);
app.provide('selectDictLabel', selectDictLabel);
app.provide('selectDictLabels', selectDictLabels);
app.provide('setDictValNum', setDictValNum);
app.provide('emitter', emitter);

app.use(router)
app.use(store)
app.use(plugins)
app.use(elementIcons)
app.use(JsonViewer)
app.component('svg-icon', SvgIcon)

directive(app)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: Cookies.get('size') || 'default'
})

app.mount('#app')
