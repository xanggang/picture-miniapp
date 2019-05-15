const app = getApp()
import promisify, { redirectTo, showToast, navigateBack, switchTab, sleep } from '../../utils/promisify.js'

Page({
  data: {

  },
  onLoad: function (options) {

  },
  async handelGetUserinfo(e) {
    const userInfo = e.detail.userInfo
    if (!userInfo) {
      await showToast({ title: '登录后享受更多！', icon: 'none', duration: 1000 })
      await sleep(1000)
      await switchTab({ url: '../index/index'}) 
      return 
    }
    const { result } = await wx.cloud.callFunction({
      name: 'userInfo',
      data: {
        action: 'login',
        loginInfo: userInfo,
      }
    })
    await navigateBack({ delta: 1 }) 
    app.globalData.isLogin = true
    app.globalData.user = result.res
  }
})