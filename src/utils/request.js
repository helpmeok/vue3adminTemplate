import axios from 'axios'
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { getToken, setToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { tansParams, blobValidate } from '@/utils/ruoyi'
import cache from '@/plugins/cache'
import { saveAs } from 'file-saver'
import useUserStore from '@/store/modules/user'
import { refreshToken } from '@/api/login'

let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 10000
})

// request拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
    if (typeof config.data === 'object') {
      // 过滤参数为空
      Object.keys(config.data).forEach(key => {
        if (config.data[key] === "" || config.data[key] === null || config.data[key] === undefined) {
          delete config.data[key]
        }
      })
    }
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
    const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
    if (requestSize >= limitSize) {
      console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
      return config;
    }
    const sessionObj = cache.session.getJSON('sessionObj')
    if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
      cache.session.setJSON('sessionObj', requestObj)
    } else {
      const s_url = sessionObj.url;                // 请求地址
      const s_data = sessionObj.data;              // 请求数据
      const s_time = sessionObj.time;              // 请求时间
      const interval = 100;                       // 间隔时间(ms)，小于此时间视为重复提交
      if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        const message = '数据正在处理，请勿重复提交';
        console.warn(`[${s_url}]: ` + message)
        return Promise.reject(new Error(message))
      } else {
        cache.session.setJSON('sessionObj', requestObj)
      }
    }
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

let isRefreshing = false
let requests = [] // 请求队列
// 响应拦截器
service.interceptors.response.use(async res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const msg = res.data.message || errorCode['default']
  // 二进制数据则直接返回
  if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
    return res.data
  }
  if (code === 1) {
    if (msg === "freshToken已失效") {
      pushLogin();
      return Promise.reject(errorCode['401'])
    } else {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(msg)
    }
  } else if (code == 401) { // 登录token过期
    if (!isRefreshing) {
      try {
        isRefreshing = true
        // 刷新token
        const Token = await refreshToken();
        if (!Token.data) {
          pushLogin();
          return
        }
        // 保存新的token
        setToken(Token.data)
        // 有新token后再重新请求
        res.config.headers.Authorization = getToken(); // 新token
        // token 刷新后将数组的方法重新执行
        requests.forEach((cb) => cb(getToken()))
        requests = [] // 重新请求完清空
        const resp = await service.request(res.config)
        isRefreshing = false
        return resp
      } catch (error) {
        isRefreshing = false
        requests = [] // 重新请求完清空
      } finally {
        if (!requests.length) {
          isRefreshing = false
        }
      }
      // return service(response.config)
    } else {
      // 返回未执行 resolve 的 Promise
      return new Promise(resolve => {
        // 用函数形式将 resolve 存入，等待刷新后再执行
        requests.push(token => {
          res.config.headers.Authorization = `${token}`
          resolve(service(res.config))
        })
      })
    }
  } else if (code === 500) {
    ElMessage({ message: msg, type: 'error' })
    return Promise.reject("服务器出错啦！")
  } else if (code !== 200) {
    ElNotification.error({ title: msg })
    return Promise.reject('error')
  } else {
    return Promise.resolve(res.data)
  }
},
  async error => {
    console.log(error)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)
const pushLogin = () => {
  if (!isRelogin.show) {
    isRefreshing = false;
    isRelogin.show = true;
    ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
      isRelogin.show = false;
      useUserStore().logOut().then(() => {
        location.href = '/index';
      })
    }).finally(() => {
      isRelogin.show = false;
    });
  }
}
// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config
  }).then(async (data) => {
    const isBlob = blobValidate(data);
    if (isBlob) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      ElMessage.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}

// 通用导出方法
export function exportFileDown(url, params, filename) {
  downloadLoadingInstance = ElLoading.service({ text: "正在导出数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    responseType: 'blob',
  }).then(async (response) => {
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    ElMessage.error('导出文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}
export default service
