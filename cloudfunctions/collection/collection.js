const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

class CollectionBase {
  constructor(data) {
    this.openId = data.openId
    this.targetUser = data.targetUser
    this.targetArticle = data.targetArticle
    this.createTime = db.serverDate()
  }
}

class Collection {

  async createCollection(data) {
    const res = await db.collection('collection').add({ data: new CollectionBase(data) })
    console.log(res)
    return 1
  }

  async delectCollection(openId, targetArticle) {
    try {
      await db.collection('collection')
        .where({
          openId: openId,
          targetArticle: targetArticle
        })
        .remove()
      return 1
    } catch (e) {
      return {
        err: e
      }
    }
  }

  // 获取用户的全部收藏
  async queryUserAllCollection(openId) {
    const { data } = await db.collection('collection')
      .where({ openId: openId })
      .get()
    return data || []
  }

  // 获取文章的收藏数量
  async queryArticleAllCollection(targetArticle) {
    const res = await db.collection('collection').where({ targetArticle: targetArticle })
    console.log(res)
    return res
  }

  // 查询是否已经收藏过改文章
  async queryIsCollection(user, targetArticle) {
    const res = await db.collection('collection')
      .where({ openId: user, targetArticle: targetArticle })
      .get()
    return !!res.data.length
  }
}

module.exports = Collection