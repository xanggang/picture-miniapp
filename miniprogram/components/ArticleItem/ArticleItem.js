// components/ArticleItem/ArticleItem.js
Component({

  properties: {
    article: {
      type: Object,
      observer: function () {
        this.setData({
          isAttention: this.data.article.user.isAttention,
          IsCollection: this.data.article.IsCollection
        })
      }
    },
    showUser: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    linkToDetail({ target }) {
      const id = target.dataset.id
      wx.navigateTo({
        url: '../article-detail/index?id=' + id,
      })
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
  }
})
