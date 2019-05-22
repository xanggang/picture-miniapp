const app = getApp()
import promisify, { getSetting, getUserInfo, navigateTo, showToast, sleep } from '../../utils/promisify.js'
Page({
  data: {
    user: null,
    page: 0,
    articleList: [],
    isLoadingMore: true,
    attentionLength: 0
  },
  onLoad: async function (options) {
    const user = await app.login()
    if (user) {
      this.setData({
        user: app.globalData.user
      })
      await this.queryArticleList()
      await this.queryAttention()
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
  async queryAttention() {
    const { result } = await wx.cloud.callFunction({
      name: 'attention',
      data: {
        action: 'queryAttentioList'
      }
    })
    this.setData({
      attentionLength: result.length
    })
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
    if (result.length === 0) {
      this.setData({
        isLoadingMore: false
      })
    }
    this.setData({
      articleList: [...this.data.articleList, ...result]
    })
    wx.hideLoading()
  },
  onPullDownRefresh: async function () {
    this.setData({
      page: 0,
      articleList: [],
      isLoadingMore: true
    })
    await this.queryArticleList()
    wx.stopPullDownRefresh()
  },
  onReachBottom: async function () {
    if (!this.data.isLoadingMore) {
      wx.showToast({
        title: '没有更多了',
      })
      return
    }
    this.setData({
      page: this.data.page + 1
    })
    await this.queryArticleList()
  },
})