const Collection = require('./collection.js')
const cloud = require('wx-server-sdk')
cloud.init()
const collection = new Collection()

class CollectionController {

  async cretaeCollection(event) {
    const isAttentio = await collection.queryIsCollection(event.openId, event.data.targetArticle)
    if (isCollection) {
      return {
        err: '已经收藏过该文章了'
      }
    }

    const createData = Object.assign({},
      { openId: event.openId },
      event.data
    )
    const res = await collection.cretaeCollection(createData)
    return res
  }

  async delectCollection(event) {
    const openId = event.openId
    const targetArticle = event.targetArticle
    const res = await collection.delectAttention(openId, targetArticle)
    return res
  }

  async queryUserAllCollection(event) {
    // 如果没有传目标， 则查询当前账户的
    let openId = event.targetUser ? event.targetUser : event.openId
    const res = await collection.queryUserAllCollection(openId)
    return res
  }

  // 获取文章所有的收藏者
  async queryArticleAllCollection(event) {
    let targetArticle = event.targetArticle
    const res = await collection.queryArticleAllCollection(targetArticle)
    return res
  }

  async queryIsCollection(event) {
    const isCollection = await collection.queryIsCollection(event.openId, event.data.targetArticle)
    return isCollection
  }
}

module.exports = AttentionController