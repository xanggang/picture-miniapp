// components/ArticleItem/ArticleItem.js
Component({

  properties: {
    article: {
      type: Object,
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
  }
})
