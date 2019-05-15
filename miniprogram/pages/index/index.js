const app = getApp()
import promisify, { getSetting, getUserInfo } from '../../utils/promisify.js'

Page({
  data: {
    user: null,
    isLogin: false,
    itemList: [],
    showLoginButton: false,
    isFirst: true
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
          loginInfo: userInfo.userInfo,
        }
      })
      app.globalData.isLogin = true
      app.globalData.user = result.res
      this.setData({
        user: result.res,
        isLogin: true,
        showLoginButton: false
      })
    } else {
      app.globalData.isLogin = false
      app.globalData.userInfo = {}
      this.setData({
        user: null,
        isLogin: false,
        showLoginButton: true
      })
    }
    this.queryItem()
  },
  onShow: function() {
    console.log(app.globalData)
    if (this.data.isFirst) {
      this.setData({
        isFirst: false
      })
      return
    }
    this.setData({
      user: app.globalData.user,
      showLoginButton: app.globalData.isLogin,
      isLogin: app.globalData.isLogin
    })
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
  linkToLogin() {
    wx.navigateTo({
      url: '../login/index',
    })
  },
  onPullDownRefresh: async function () {
    console.log('onPullDownRefresh')
    await this.queryItem()
    wx.stopPullDownRefresh()
  }
})
