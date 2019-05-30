const cloud = require('wx-server-sdk')
const to = require('await-to-js').default;
cloud.init()
const db = cloud.database()
const _ = db.command

class CollectionBase {
  constructor(data) {
    this.openId = data.openId // 收藏者
    this.targetUser = data.targetUser // 
    this.targetArticle = data.targetArticle
    this.createTime = db.serverDate()
  }
}

class Collection {

  async createCollection(data) {
    const [err, res] = await to(db.collection('collection').add({ data: new CollectionBase(data) }))
    if (err) return Promise.reject(err.errMsg)
    return res._id
  }

  async delectCollection(openId, targetArticle) {
    const [err, res] = await to(db.collection('collection')
      .where({
        openId: openId,
        targetArticle: targetArticle
      })
      .remove())
    if (err) return Promise.reject(err.errMsg)
    return res
  }

  // 获取用户的全部收藏
  async queryUserAllCollection(openId) {
    const [err, { data }] = await to(db.collection('collection')
      .where({ openId: openId })
      .get())
    if (err) return Promise.reject(err.errMsg)
    return data
  }

  // 获取文章的收藏数量
  async queryArticleAllCollection(targetArticle) {
    const [err, {data}] = await db.collection('collection').where({ targetArticle: targetArticle })
    if (err) return Promise.reject(err.errMsg)
    return data
  }

  // 查询是否已经收藏过改文章
  async queryIsCollection(user, targetArticle) {
    const [err, {data}] = await to(db.collection('collection')
      .where({ openId: user, targetArticle: targetArticle })
      .get())
    if (err) return Promise.reject(err.errMsg)
    return data
  }

  // 更新文章收藏数目
  async updateArticleTotal(id, type) {
    const number = type === 'add' ? 1 : -1
    const [err, res] = await to(db.collection('article').doc(id).update({
      data: {
        collection: _.inc(number)
      }
    }))
    if (err) return Promise.reject(err.errMsg)
    return res.stats.updated
  }
}

module.exports = Collection