import promisify, { chooseImage, navigateTo, showToast, sleep } from '../../utils/promisify.js'
import { updateImg } from '../../utils/update.js'
const app = getApp()
Page({
  data: {
    tempFilePaths: [],
    text: ''
  },
  onLoad: async function (options) {
    this.checkLogin()
  },
  onShow: async function (options) {
    this.checkLogin()
  },
  async checkLogin() {
    if (!app.globalData.isLogin) {
      await showToast({ title: '你还没有登录， 请前往登录', icon: 'none', duration: 1000 })
      await sleep(1000)
      await navigateTo({ url: '../login/index' })
    }
  },
  handleInput({ detail }) {
    this.setData({
      text: detail.value
    })
  },
  async handlehooseimg() {
    if (this.data.tempFilePaths.length >= 9) {
      wx.showToast({
        title: '一次性最多上传9张图片',
        icon: 'success_no_circle',
        duration: 2000
      })
      return
    }
    const { tempFilePaths } = await chooseImage({
      count: 9 - this.data.tempFilePaths.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).catch(e => {
      wx.showToast({
        title: '选择文件失败',
        icon: 'warn',
        duration: 2000
      })
    })
    this.setData({
      tempFilePaths: [...this.data.tempFilePaths, ...tempFilePaths]
    })
  },
  handledeleteimg({ currentTarget}) {
    const index = currentTarget.dataset.index
    let imngList = this.data.tempFilePaths
    imngList.splice(index, 1)
    this.setData({
      tempFilePaths: imngList
    })
  },
  async handlesave() {
    const user = app.globalData.user
    const openId = user.openId
    wx.showLoading({
      title: '上传中',
      mask: true,
    })
    const flies = await updateImg({
      paths: this.data.tempFilePaths,
      openId: openId
    })
    const a = await wx.cloud.callFunction({
      name: 'article',
      data: {
        action: 'createArticle',
        articleData: {
          title: 'noTitle',
          imgList: flies,
          content: this.data.text
        }
      }
    })
    wx.hideLoading()
    wx.showToast({
      title: '上传完成',
    })
    this.setData({
      tempFilePaths: [],
      text: ''
    })
  },
})