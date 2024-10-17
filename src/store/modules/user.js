import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { getRegionTree } from "@/api/common";
import cache from "@/plugins/cache";
const useUserStore = defineStore(
  'user',
  {
    state: () => ({
      token: getToken(),
      refreshToken: getRefreshToken(),
      id: '',
      name: '',
      avatar: '',
      productType: "",
      roles: [],
      permissions: []
    }),
    actions: {
      // 登录
      login(data) {
        return new Promise((resolve, reject) => {
          login(data).then(res => {
            setToken(res.data.token)
            setRefreshToken(res.data.refreshToken)
            this.token = res.data.token
            this.refreshToken = res.data.refreshToken
            cache.local.setJSON("region-tree-data", []);
            // 获取省市区列表存储到本地
            // getRegionTree().then((res) => {
            //   cache.local.setJSON("region-tree-data", res.data);
            // });
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 获取用户信息
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            this.roles = [res.data.role]
            this.permissions = ["*:*:*"]
            this.productType = res.data.productType
            this.id = res.data.id
            this.name = res.data.name
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      // 退出系统
      logOut() {
        return new Promise((resolve, reject) => {
          this.token = ''
          this.refreshToken = ''
          this.roles = []
          this.permissions = []
          removeToken()
          removeRefreshToken()
          resolve()
        })
      }
    }
  })

export default useUserStore
