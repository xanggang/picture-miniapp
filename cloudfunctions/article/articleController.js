const Article = require('./article.js')
const cloud = require('wx-server-sdk')
cloud.init()
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

  async queryArticlebyId(event) {
    const { userInfo, id } = event
    let resList = await article.queryArticlebyId(id)
    if (resList.length === 0) {
      return []
    }
    let res = resList[0]
    if (Array.isArray(res.imgList) && res.imgList.length > 0) {
      res.showImgList = await article.queryTempFileURL(res.imgList)
    }
    const { result } = await cloud.callFunction({
      name: 'userInfo',
      data: {
        action: 'queryUserByOpenid',
        openId: res.openId
      }
    })
    let user = result.length > 0 ? result[0] : null
    res.user = user
    console.log(result)
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
    for (const item of resList) {
      if ((Array.isArray(item.imgList) && item.imgList.length > 0)) {
        item.showImgList = await article.queryTempFileURL(item.imgList)
        const { result } = await cloud.callFunction({
          name: 'userInfo',
          data: {
            action: 'queryUserByOpenid',
            openId: item.openId
          }
        })
        let user = result.length > 0 ? result[0] : null
        item.user = user
      }
    }

    return resList
  }

  async queryArticleAll(event) {
    const { userInfo, size = 10, page, sort = 'desc', orderBy ='createTime' } = event
    console.log(event)
    let resList = await article.queryArticleAll({ size, page, sort, orderBy })
    if (resList.length === 0) {
      return []
    }

    for (const item of resList) {
      if ((Array.isArray(item.imgList) && item.imgList.length > 0)) {
        item.showImgList = await article.queryTempFileURL(item.imgList)
        const { result } = await cloud.callFunction({
          name: 'userInfo',
          data: {
            action: 'queryUserByOpenid',
            openId: item.openId
          }
        })
        let user = result.length > 0 ? result[0] : null
        item.user = user
      }
    }

    return resList
  }
}

module.exports = ArticleController