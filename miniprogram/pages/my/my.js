const app = getApp()
import promisify, { getSetting, getUserInfo, navigateTo, showToast, sleep } from '../../utils/promisify.js'
import callFunction from '../../utils/callFunction.js'

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
    const result = await callFunction({
      name: 'attention',
      action: 'queryAttentioList',
    })
    this.setData({
      attentionLength: result.length
    })
  },
  async queryArticleList() {
    wx.showLoading({
      title: '加载中',
    })
    const result = await callFunction({
      name: 'article',
      action: 'queryArticleByOpenId',
      data: {
        page: this.data.page,
        size: 5
      }
    })
    this.setData({
      isLoadingMore: result && result.length === 5
    })
    this.setData({
      articleList: [...this.data.articleList, ...result]
    })
    wx.hideLoading()
  },
  linkToCollectionList() {
    wx.navigateTo({
      url: '../my-collection/index',
    })
  },
  onPullDownRefresh: async function () {
    this.setData({
      page: 0,
      articleList: [],
      isLoadingMore: true
    })
    await this.queryArticleList()
    await this.queryAttention()
    wx.stopPullDownRefresh()
  },
  onReachBottom: async function () {
    if (!this.data.isLoadingMore) {
      return
    }
    this.setData({
      page: this.data.page + 1
    })
    await this.queryArticleList()
  },
})