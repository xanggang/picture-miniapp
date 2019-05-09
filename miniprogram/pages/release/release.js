// miniprogram/pages/release/release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'test',
      // 传给云函数的参数
      data: {
        b: 19,
        a: 89898
      },
      // 成功回调
      complete: function(e) {
        console.log(e)
      }
    })
  },
  handleInput(e) {
    console.log(e)
  }
})