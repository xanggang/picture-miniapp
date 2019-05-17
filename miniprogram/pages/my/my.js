const app = getApp()
import promisify, { getSetting, getUserInfo, navigateTo, showToast, sleep } from '../../utils/promisify.js'
Page({
  data: {
    user: null,
    page: 0,
    articleList: []
  },
  onLoad: async function (options) {
    const user = await app.login()
    if (user) {
      this.setData({
        user: app.globalData.user
      })
      await this.queryArticleList()
      return
    }
    this.checkLogin()
  },
  async checkLogin() {
    if (!app.globalData.isLogin) {
      await showToast({ title: '你还没有登录， 请前往登录', icon: 'none', duration: 1000 })
      await sleep(1000)
      await navigateTo({ url: '../login/index' })
    }
  },
  async queryArticleList() {
    wx.showLoading({
      title: '加载中',
    })
    const { result } = await wx.cloud.callFunction({
      name: 'article',
      data: {
        action: 'queryArticleByOpenId',
        page: this.data.page,
        size: 2
      }
    })
    console.log(result)
    this.setData({
      articleList: [...this.data.articleList, ...result]
    })
    wx.hideLoading()
  },
  onPullDownRefresh: async function () {
    this.setData({
      page: 0,
      articleList: []
    })
    await this.queryArticleList()
    wx.stopPullDownRefresh()
  },
  onReachBottom: async function () {
    this.setData({
      page: this.data.page + 1
    })
    await this.queryArticleList()
  },
})