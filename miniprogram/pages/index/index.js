const app = getApp()
import promisify, { getSetting, getUserInfo } from '../../utils/promisify.js'
import callFunction from '../../utils/callFunction.js'

Page({
  data: {
    user: null,
    isLogin: false,
    itemList: [],
    showLoginButton: false,
    page: 0,
    isHaveMore: true
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
        orderBy: 'recommend',
        size: 10
      }
    })
    console.log(result)
    this.setData({
      itemList: [...this.data.itemList, ...result || []],
      isHaveMore: !result || result.length < 10
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
    wx.stopPullDownRefresh()
    this.setData({
      page: 0,
      itemList: [],
      isHaveMore: false
    })
    await this.queryItem()
  },
  onReachBottom: async function () {
    if (this.data.isHaveMore) return 
    console.log('onPullDownRefresh')
    this.setData({
      page: this.data.page + 1
    })
    await this.queryItem()
  },
})
