const app = getApp()
import promisify from '../../utils/promisify.js'
const getSetting = promisify(wx.getSetting)
const getUserInfo = promisify(wx.getUserInfo)

Page({
  data: {
    user: null,
    isLogin: false
  },
  onLoad: async function() {
    // 获取用户信息
    const userSetting = await getSetting()
    let userInfo = null
    if (userSetting.authSetting['scope.userInfo']) {
      userInfo = await getUserInfo()
      const { result } = await wx.cloud.callFunction({
        name: 'userInfo',
        data: {
          action: 'login',
          loginInfo: userInfo.userInfo
        }
      })
      console.log(result)
      app.globalData.isLogin = true
      app.globalData.user = result.res
      this.setData({
        user: result.res,
        isLogin: true
      })
    } else {
      app.globalData.isLogin = false
      app.globalData.userInfo = {}
      this.setData({
        user: null,
        isLogin: false
      })
    }
  }
})
