

Page({
  data: {
    articleDatail: {},
    id: '',
    img: 'https://7465-test-ujxfk-1259107688.tcb.qcloud.la/article/obFwE0S8S9xRvrWLaHludj8AI2fk/1557833521696.jpg'
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
      articleDatail: detail.result
    })
    wx.hideLoading()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})