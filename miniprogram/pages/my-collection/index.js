import callFunction from '../../utils/callFunction'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryCollectionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryCollectionList()
  },
  async queryCollectionList() {
    const res = await callFunction({
      name: 'collection',
      action: 'queryUserAllCollection'
    })
    this.setData({
      queryCollectionList: res
    })
  },
  onPullDownRefresh: function () {
    this.queryCollectionList()
  },
})