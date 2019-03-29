function index() {
  const showTabBarRedDotOld = wx.showTabBarRedDot
  const hideTabBarRedDotOld = wx.hideTabBarRedDot
  const redDotList = Array.from({length: __wxConfig.tabBar.list.length}, () => false)
  const redDotBus = []
  const showTabBarRedDotNew = function (option) {
    const {index} = option
    if (typeof index !== 'number' || index < 0 || index >= redDotList.length) {
      return
    }
    redDotList[index] = true
    redDotBus.forEach(fun => {
      if (typeof fun === 'function') {
        fun()
      }
    })
    showTabBarRedDotOld(option)
  }
  const hideTabBarRedDotNew = function (option) {
    const {index} = option
    if (typeof index !== 'number' || index < 0 || index >= redDotList.length) {
      return
    }
    redDotList[index] = false
    redDotBus.forEach(fun => {
      if (typeof fun === 'function') {
        fun()
      }
    })
    hideTabBarRedDotOld(option)
  }
  Object.defineProperty(wx, 'showTabBarRedDot', {
    enumerable: true,
    configurable: true,
    writable: true,
    value: showTabBarRedDotNew
  })
  Object.defineProperty(wx, 'hideTabBarRedDot', {
    enumerable: true,
    configurable: true,
    writable: true,
    value: hideTabBarRedDotNew
  })
  return [redDotList, redDotBus]
}

const [redDotList, redDotBus] = index()

export const getDotList = function () {
  return redDotList || []
}

export const listenDotListChange = function (fn) {
  if (Array.isArray(redDotBus)) {
    redDotBus.push(fn)
  }
}

export default {
  getDotList,
  listenDotListChange
}
