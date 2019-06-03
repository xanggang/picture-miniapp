import callFunction from '../../utils/callFunction.js'

Page({
  data: {
    articleDatail: {},
    id: '',
    img: '',
    isAttention: false,
    isCollection: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.getArticleDatail()
  },
  onUnload: function () {

  },
  async getArticleDatail() {
    wx.showLoading({
      title: '加载中...',
    })
    const result = await callFunction({
      name: 'article',
      action: 'queryArticlebyId',
      data: {
        id: this.data.id
      }
    })
    console.log(result)
    this.setData({
      articleDatail: result,
      isAttention: result.user.isAttention,
      isCollection: result.isCollection
    })
    wx.hideLoading()
  },

  async attentioUser({ target }) {
    const openId = target.dataset.openid
    const isattention = target.dataset.isattention

    const result = await callFunction({
      name: 'attention',
      action: isattention ? 'delectAttention' : 'cretaeAttention',
      data: {
        targetUser: openId
      }
    })
    this.setData({
      isAttention: !this.data.isAttention
    })

    wx.showToast({
      title: result ? '操作成功' : '操作失败',
    })
  },
  async collection({target}) {
    const openId = target.dataset.openid
    const iscollection = target.dataset.iscollection

    const result = await callFunction({
      name: 'collection',
      action: iscollection ? 'delectCollection' : 'cretaeCollection',
      data: {
        targetArticle: this.data.id
      }
    })
    this.setData({
      isCollection: !this.data.isCollection
    })

    wx.showToast({
      title: result ? '操作成功' : '操作失败',
    })
  },
  shareAppToGroup() {
    wx.showToast({
      title: '暂未开放'
    })
  },
  onShareAppMessage: function (a) {
    console.log(a)
    return 
    return {
      title: this.data.articleDatail.content,
      path: '/pages/article-detail/index?id=' + this.data.articleDatail._id
    }
  }
})