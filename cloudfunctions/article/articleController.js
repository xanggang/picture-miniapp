const Article = require('./article.js')
const cloud = require('wx-server-sdk')
const to = require('await-to-js').default;
cloud.init()
const article = new Article()

class ArticleController {

  // 创建新的文章
  // todo 调用腾讯接口进行内容安全教研
  async createArticle(event) {
    const { OPENID, articleData } = event
    const { title, imgList, content } = articleData
    const [err, res] = await to(article.createArticle({
      title,
      imgList,
      content,
      openId: OPENID
    }))

    if (err) return {err, res}

    const [error, articleRes] = await to(article.queryArticlebyId(res))
    if (error) return { err: error, res: null }
    return { err: null, res: articleRes }
  }

  async queryArticlebyId(event) {
    const { OPENID, id } = event
    let [err, res] = await to(article.queryArticlebyId(id))
    // 有错误返回错误， 没有查到返回空
    if (err) return {err, res}
    if (!res) return {err, res}
    // 查询文章用户
    const [error, { result }] = await to(cloud.callFunction({
      name: 'userInfo',
      data: {
        action: 'queryUserByOpenid',
        currentUser: event.OPENID,
        targetUser: res.openId
      }
    }))
    // 调用userInfo错伏、、错误
    if (error) return {err: error, res}
    // userInfo自己的错误
    if (result.err) return {err: result.err, res: res}
    res.user = result.res
    return res
  }

  async queryArticleByOpenId(event) {
    const { size = 10, page, OPENID, targetUser } = event
    let openId = targetUser || OPENID
    let [err, articleList] = await to(article.queryArticleByOpenId({ size, page, openId }))
    if (err) return {err, res}

    if (articleList.length === 0) {
      return []
    }
    
    // 查询文章用户
    const [err, { result }] = await to(cloud.callFunction({
      name: 'userInfo',
      data: {
        action: 'queryUserByOpenid',
        currentUser: OPENID,
        targetUser: openId
      }
    }))

    let user = result.length > 0 ? result[0] : null
    
    articleList.forEach(article => {
      article.user = user
    })
    return articleList
  }

  async queryArticleAll(event) {
    const { userInfo, size = 10, page, sort = 'desc', orderBy = 'createTime' } = event
    let ArticleList = await article.queryArticleAll({ size, page, sort, orderBy })
    if (ArticleList.length === 0) {
      return []
    }

    const funLisy = ArticleList.map(async article => {
      // 查询文章的相关处理
      // 查询文章的作者
      const [err, { result }] = await to(cloud.callFunction({
        name: 'userInfo',
        data: {
          action: 'queryUserByOpenid',
          currentUser: event.OPENID,
          targetUser: article.openId
        }
      }))
      let user = result.res || null
      article.user = user
      return article
    })

    return Promise.all(funLisy)
  }

  async handleArticle(article, event) {
    const currentUserId = event.OPENID
    // 查询文章的作者
    const { result } = await cloud.callFunction({
      name: 'userInfo',
      data: {
        action: 'queryUserByOpenid',
        currentUser: currentUserId,
        targetUse: article.openId
      }
    })
    let user = result.length > 0 ? result[0] : null
    article.user = user
    return article
  }
}

module.exports = ArticleController