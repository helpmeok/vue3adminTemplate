import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore(
  'permission',
  {
    state: () => ({
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRouters: [],
      sidebarRouters: []
    }),
    actions: {
      setRoutes(routes) {
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      setDefaultRoutes(routes) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      setTopbarRoutes(routes) {
        this.topbarRouters = routes
      },
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      generateRoutes(roles) {
        // 动态获取路由地址
        return new Promise(resolve => {
          let res = {
            "data": [
              {
                name: "CalcPrice",
                path: "/calcPrice",
                hidden: false,
                component: "Layout",
                alwaysShow: true,
                redirect: "noRedirect",
                meta: {
                  title: "计价管理",
                  icon: "money",
                  noCache: false,
                },
                children: [
                  {
                    name: "WorkflowManage",
                    path: "workflowManage",
                    hidden: false,
                    roles: ["Admin", "ProductTypeAdmin"],
                    component: "system/workflowManage/index",
                    meta: {
                      title: "计价流程",
                      icon: "",
                      noCache: false,
                    },
                  },
                  {
                    name: "PriceLog",
                    path: "priceLog",
                    hidden: false,
                    roles: ["Admin", "ProductTypeAdmin"],
                    component: "system/priceLog/index",
                    meta: {
                      title: "计价日志",
                      icon: "",
                      noCache: false,
                    },
                  }
                ]
              },
              {
                name: "System",
                path: "/system",
                hidden: false,
                component: "Layout",
                alwaysShow: true,
                redirect: "noRedirect",
                meta: {
                  title: "基础配置管理",
                  icon: "system",
                  noCache: false,
                },
                children: [
                  {
                    name: "DictBase",
                    path: "dict/base",
                    hidden: false,
                    roles: ["Admin"],
                    component: "system/dict/index",
                    meta: {
                      title: "字典管理",
                      icon: "",
                      noCache: false,
                    },
                  },
                  {
                    name: "DictBusiness",
                    path: "dict/business",
                    hidden: false,
                    roles: ["Admin", "ProductTypeAdmin"],
                    component: "system/dict/index",
                    meta: {
                      title: "材质优先级配置",
                      icon: "",
                      noCache: false,
                    },
                  },
                  {
                    name: "ProductTypeAdmin",
                    path: "user",
                    hidden: false,
                    roles: ["Admin"],
                    component: "system/user/index",
                    meta: {
                      title: "用户管理",
                      icon: "",
                      noCache: false,
                    },
                  },
                  {
                    name: "BasePrice",
                    path: "basePrice",
                    hidden: false,
                    roles: ["Admin", "ProductTypeAdmin"],
                    component: "system/basePrice/index",
                    meta: {
                      title: "基础计价表",
                      icon: "",
                      noCache: false,
                    },
                  },
                  {
                    name: "MaterCorrespond",
                    path: "materCorrespond",
                    hidden: false,
                    roles: ["Admin", "ProductTypeAdmin"],
                    component: "system/materCorrespond/index",
                    meta: {
                      title: "材质对应表",
                      icon: "",
                      noCache: false,
                    },
                  },
                  {
                    name: "ProductSizeSet",
                    path: "productSizeSet",
                    hidden: false,
                    roles: ["Admin", "ProductTypeAdmin"],
                    component: "system/productSizeSet/index",
                    meta: {
                      title: "产品尺寸配置",
                      icon: "",
                      noCache: false,
                    },
                  },

                ]
              },
            ]
          }
          res.data = rolePermissDynamicRoutes(res.data)
          // 向后端请求路由数据
          // getRouters().then(res => {
          const sdata = JSON.parse(JSON.stringify(res.data))
          const rdata = JSON.parse(JSON.stringify(res.data))
          const defaultData = JSON.parse(JSON.stringify(res.data))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const defaultRoutes = filterAsyncRouter(defaultData)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          asyncRoutes.forEach(route => { router.addRoute(route) })
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
          // })
        })
      }
    }
  })

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
      if (el.children && el.children.length) {
        children = children.concat(filterChildren(el.children, el))
        return
      }
    }
    children = children.concat(el)
  })
  return children
}
// 根据角色控制菜单
export function rolePermissDynamicRoutes(routes) {
  const res = routes.map(route => {
    if (route?.children?.length) {
      route.children = route.children.filter(item => {
        return auth.hasRoleOr(item.roles)
      })
    }
    return route;
  })
  return res
}
// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
}

export default usePermissionStore
