const Article = require('./article.js')
const article = new Article()

class ArticleController {
  constructor() { }
  createArticle(event) {
    const { userInfo } = event
    const { 
      title,
      imgList,
      content
    } = event.articleData

    return article.createArticle({
      title,
      imgList,
      content,
      openId: userInfo.openId
    })
  }

  getArticleDetail(_id) {
    return article.geArticle(_id)
  }


}

module.exports = ArticleController