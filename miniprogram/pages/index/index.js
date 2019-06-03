const app = getApp()
import promisify, { getSetting, getUserInfo } from '../../utils/promisify.js'
import callFunction from '../../utils/callFunction.js'

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
  async queryItem() {
    wx.showLoading({
      title: 'loading',
    })
    const result = await callFunction({
      name: 'article',
      action: 'queryArticleAll',
      data: {
        page: this.data.page,
        orderBy: 'createTime',
        size: 10
      }
    })
    console.log(result)
    this.setData({
      itemList: result
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
