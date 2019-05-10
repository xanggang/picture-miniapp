const app = getApp()
import promisify from '../../utils/promisify.js'
const getSetting = promisify(wx.getSetting)
const getUserInfo = promisify(wx.getUserInfo)

Page({
  data: {

  },
  onLoad: async function() {
    // 获取用户信息
    const userSetting = await getSetting()
    if (userSetting.authSetting['scope.userInfo']) {
      const userInfo = await getUserInfo()
      app.globalData.userInfo = userInfo
      console.log(userInfo)
    } else {
      app.globalData.isLogin = false
      app.globalData.isRegister = false
      app.globalData.userInfo = {}
    }

    const logonInfo = await wx.cloud.callFunction({
      name: 'login'
    })
    // console.log(logonInfo)

    const res = await wx.cloud.callFunction({
      name: 'userInfo'
    })

    console.log(res)
    // app.globalData.appid = logonInfo.result.appid
    // app.globalData.openid = logonInfo.result.openid

  }
})
