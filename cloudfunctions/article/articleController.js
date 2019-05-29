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