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
    console.log(userSetting)
    if (userSetting.authSetting['scope.userInfo']) {
      const userInfo = await getUserInfo()
      console.log(userInfo)
    }
    return
    wx.getSetting({
      // 一层
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // 两层
          wx.getUserInfo({
            success: res => {
              // 如果要ajax 这里就是三层
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  }
})
