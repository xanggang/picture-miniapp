const app = getApp()
import promisify from '../../utils/promisify.js'
const getSetting = promisify(wx.getSetting)
const getUserInfo = promisify(wx.getUserInfo)

Page({
  data: {
    user: null,
    isLogin: false,
    itemList: []
  },
  onLoad: async function () {
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
    this.queryItem()

  },
  async queryItem() {
    wx.showLoading({
      title: 'loading',
    })
    const itemList = await wx.cloud.callFunction({
      name: 'article',
      data: {
        action: 'queryArticleAll',
        page: 0,
        orderBy: 'createTime',
        size: 10
      }
    })
    this.setData({
      itemList: itemList.result
    })
    wx.hideLoading()
    return Promise.resolve()
  },
  onPullDownRefresh: async function () {
    console.log('onPullDownRefresh')
    await this.queryItem()
    wx.stopPullDownRefresh()
  }
})
