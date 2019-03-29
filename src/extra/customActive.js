let active = false
const bus = []

export const getActive = function () {
  return active
}

export const setActive = function (status) {
  active = status
  bus.forEach(fn => {
    if (typeof fn === 'function') {
      fn(active)
    }
  })
}
export const listenActiveChange = function (fn) {
  bus.push(fn)
}

export default {
  getActive,
  setActive,
  listenActiveChange
}
