// components/ShowImages.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgList: {
      type: Array,
      observer: function () {
        this.setData({
          imgTotal: this.data.imgList.length
        })
      }
    },
    allowPreview: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgTotal: 0, // 图片的总数量
  },

  methods: {
    previewImage(event) {
      if (!this.data.allowPreview) {
        return
      }
      wx.previewImage({
        current: this.data.imgList[event.currentTarget.dataset.index],
        urls: this.data.imgList,
        fail: function(e) {
          console.log(e)
        }
      })
    }
  }
})
