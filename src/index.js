import {getDotList, listenDotListChange} from './extra/redDot'
import {getActive, setActive, listenActiveChange} from './extra/customActive'
// 通过app.json配置的 tabBar 解析成组件可用的list
const fixListConfig = function (item, index) {
  const result = {} // 使用新对象，类似浅拷贝
  result.pagePath = '/' + item.pagePath.replace(/.html$/g, '')
  result.iconPath = item.iconData
    ? 'data:image/png;base64,' + item.iconData
    : '/' + item.iconPath.replace(/\\/g, '/')
  result.selectedIconPath = item.selectedIconData
    ? 'data:image/png;base64,' + item.selectedIconData
    : '/' + item.selectedIconPath.replace(/\\/g, '/')
  result.idx = index
  result.redDot = false
  result.text = item.text
  return result
}

const _tabBar = __wxConfig.tabBar
if (!_tabBar) {
  throw new Error('app.json 未定义tabBar')
}
wx.hideTabBar()

Component({
  properties: {
    borderColor: {
      type: String,
      value: ''
    }
  },
  data: {
    activeIdx: -1,
    config: _tabBar,
    list: _tabBar.list.map(fixListConfig),
    // 自定义节点
    customOrder: Math.floor(_tabBar.list.length / 2) - 1,
    customActive: false,
    customTransitionTime: '0.3s'
  },
  methods: {
    switchTab(evt) {
      const {pagePath} = evt.currentTarget.dataset
      wx.switchTab({
        url: pagePath
      })
    },
    updateRedDot() {
      if (Array.isArray(getDotList())) {
        this.setData({
          list: this.data.list.map(item => {
            item.redDot = getDotList()[item.idx]
            return item
          })
        })
      }
    },
    updateCustomNodeActive(status) {
      this.setData({
        customActive: status
      })
    },
    handleCustomNodeTap() {
      setActive(!this.data.customActive)
    }
  },
  ready() {
    this.updateRedDot()
    listenDotListChange(this.updateRedDot.bind(this))
    if (this.data.config.customNode) {
      listenActiveChange(this.updateCustomNodeActive.bind(this))
    }
  },
  pageLifetimes: {
    show() {
      const pages = getCurrentPages()
      const page = pages[pages.length - 1]
      const route = page.__route__
      const idx = this.data.list.find(item => item.pagePath === `/${route}`).idx
      if (this.data.activeIdx !== idx) {
        this.setData({
          activeIdx: idx
        })
      }
      if (this.data.config.customNode && this.data.customActive !== getActive()) {
        this.setData({
          customActive: getActive()
        })
      }
    }
  }
})
