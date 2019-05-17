const app = getApp()
import promisify, { getSetting, getUserInfo } from '../../utils/promisify.js'

Page({
  data: {
    user: null,
    isLogin: false,
    itemList: [],
    showLoginButton: false,
    isFirst: true,
    page: 0
  },
  onLoad: async function () {
    const user = await app.login()
    .catch(e => {
      this.setData({
        user: null,
        isLogin: false,
        showLoginButton: true
      })
    })
    if (user) {
      this.setData({
        user: user,
        isLogin: true,
        showLoginButton: false
      })
    }
    await this.queryItem()
  },
  onShow: function() {
    console.log('onShow')
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
        page: this.data.page,
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
    this.setData({
      page: this.data.page + 1
    })
    await this.queryItem()
    wx.stopPullDownRefresh()
  },
  onReachBottom: async function () {
    this.setData({
      page: 0
    })
    await this.queryItem()
  },
})
