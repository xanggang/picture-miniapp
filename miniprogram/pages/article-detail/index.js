

Page({
  data: {
    articleDatail: {},
    id: '',
    img: '',
    isAttention: false
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
    const detail = await wx.cloud.callFunction({
      name: 'article',
      data: {
        action: 'queryArticlebyId',
        id: this.data.id
      }
    })
    this.setData({
      articleDatail: detail.result,
      isAttention: detail.result.user.isAttention
    })
    wx.hideLoading()
  },

  async attentioUser({ target }) {
    const openId = target.dataset.openid
    const isattention = target.dataset.isattention
    let res = null
    if (isattention) {
      res = await wx.cloud.callFunction({
        name: 'attention',
        data: {
          action: 'delectAttention',
          data: {
            targetUser: openId
          }
        }
      })
    } else {
      res = await wx.cloud.callFunction({
        name: 'attention',
        data: {
          action: 'cretaeAttention',
          data: {
            targetUser: openId
          }
        }
      })
    }
    if (res.result === 1) {
      this.setData({
        isAttention: !this.data.isAttention
      })
      wx.showToast({
        title: '操作成功',
      })
      return
    }
    wx.showToast({
      title: '操作失败',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})