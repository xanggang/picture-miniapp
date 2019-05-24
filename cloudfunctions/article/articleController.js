const Article = require('./article.js')
const cloud = require('wx-server-sdk')
cloud.init()
const article = new Article()

class ArticleController {

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

  async queryArticlebyId(event) {
    const { OPENID } = wxContext
    const { userInfo, id } = event
    let resList = await article.queryArticlebyId(id)
    if (resList.length === 0) {
      return []
    }
    let res = resList[0]

    // 查询文章用户
    const { result } = await cloud.callFunction({
      name: 'userInfo',
      data: {
        action: 'queryUserByOpenid',
        currentUserId: OPENID,
        targetUserUserId: openId
      }
    })
    let user = result.length > 0 ? result[0] : null
    // 查询的用户是否关注作者,
    if (user !== null) {
      const isAttention = await cloud.callFunction({
        name: 'attention',
        data: {
          action: 'queryIsAttention',
          data: {
            openId: event.openId,
            targetUser: res.openId
          }
        }
      })
      user.isAttention = isAttention.result
    }
    res.user = user
    return res
  }

  async queryArticleByOpenId(event) {
    const { size = 10, page } = event
    const wxContext = cloud.getWXContext()
    const { OPENID } = wxContext
    let openId = event.openId || OPENID

    let resList = await article.queryArticleByOpenId({ size, page, openId })
    if (resList.length === 0) {
      return []
    }
    
    // 查询文章用户
    const { result } = await cloud.callFunction({
      name: 'userInfo',
      data: {
        action: 'queryUserByOpenid',
        currentUserId: OPENID,
        targetUserUserId: openId
      }
    })
    let user = result.length > 0 ? result[0] : null
    
    resList.forEach(article => {
      article.user = user
    })
    return resList
  }

  async queryArticleAll(event) {
    const { userInfo, size = 10, page, sort = 'desc', orderBy = 'createTime' } = event
    let ArticleList = await article.queryArticleAll({ size, page, sort, orderBy })
    if (ArticleList.length === 0) {
      return []
    }

    const funLisy = ArticleList.map(article => {
      // 查询文章的相关处理
      return this.handleArticle(article, event)
    })

    return Promise.all(funLisy)
  }

  async handleArticle(article, event) {
    const currentUserId = event.openId
    // 查询文章的作者
    const { result } = await cloud.callFunction({
      name: 'userInfo',
      data: {
        action: 'queryUserByOpenid',
        currentUserId: currentUserId,
        targetUserUserId: article.openId
      }
    })
    let user = result.length > 0 ? result[0] : null
    article.user = user
    return article
  }
}

module.exports = ArticleController