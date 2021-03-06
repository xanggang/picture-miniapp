import callFunction from '../../utils/callFunction'
Component({

  properties: {
    article: {
      type: Object,
      observer: function () {
        if (!this.data.showUser) return 
        this.setData({
          isAttention: this.data.article.user.isAttention
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
      console.log(isattention)
      let res = null
      if (isattention) {
        res = await callFunction({
          name: 'attention',
          action: 'delectAttention',
          data: {
            targetUser: openId
          }
        })
      } else {
        res = await callFunction({
          name: 'attention',
          action: 'cretaeAttention',
          data: {
            targetUser: openId
          }
        })
      }
      if (res) {
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
    async updateRecommend() {
      const res = callFunction({
        name: 'article',
        action: 'updateRecommend',
        data: {
          targetArticle: this.data.article._id
        }
      })
      if (res) {
        wx.showToast({
          title: '操作成功'
        })
      }
    }
  }
})
