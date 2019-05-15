function promisify (api) {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
    });
  }
}
export default promisify

export const getSetting = promisify(wx.getSetting)
export const getUserInfo = promisify(wx.getUserInfo)
export const redirectTo = promisify(wx.redirectTo)
export const showToast = promisify(wx.showToast)
export const navigateBack = promisify(wx.navigateBack)
export const switchTab = promisify(wx.switchTab)
export const chooseImage = promisify(wx.chooseImage)
export const navigateTo = promisify(wx.navigateTo)
export const sleep = function (ms) {
  return new Promise(res => {
    setTimeout(res, ms)
  })
}