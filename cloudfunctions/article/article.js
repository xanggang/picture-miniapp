const cloud = require('wx-server-sdk')
const path = require('path')
cloud.init()
const db = cloud.database()

class ArticleBase {
  constructor(data) {
    this.createTime = db.serverDate()
    this.modifyTime = db.serverDate()
    this.title = data.title
    this.content = data.content
    this.openId = data.openId // 作者
    this.commentTotal = 0 // 评论
    this.collection = 0  // 收藏
    this.imgList = data.imgList 
    this.recommend = 0 // 推荐
    this.status = 0 // 状态 0 正常 1禁止展示
    this.tag = ''
  }
}

class Article {
  constructor() { }
  // 添加新的文章
  async createArticle(data) {
    const res = await db.collection('article').add({ data: new ArticleBase(data) })
    const article = await db.collection('article').where({ _id: res._id })
      .get()
    return article.data[0]
  }

  async queryArticlebyId(id) {
    const { data } = await db.collection('article').where({ _id: id })
      .get()
    return data
  }

  async queryTempFileURL(fileList) {
    const files = await cloud.getTempFileURL({
      fileList
    })

    return files.fileList
  }

  async queryArticleByOpenId({ size, page, openId }) {
    const { data } = await db.collection('article')
      .where({
        openId: openId, // 填入当前用户 openid
      })
      .orderBy('createTime', 'desc')
      .skip(10 * page) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(size) // 限制返回数量为 10 条
      .get()

    return data
  }

  async queryArticleAll({ size, page, orderBy, sort}) {
    const { data } = await db.collection('article')
      .orderBy(orderBy, sort)
      .skip(10 * page) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(size) // 限制返回数量为 10 条
      .get()

    return data
  }

  async deleteArticle(id) {
    try {
      return await db.collection('article').doc(id).remove()
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = Article