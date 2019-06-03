const Collection = require('./collection.js')
const cloud = require('wx-server-sdk')
const to = require('await-to-js').default;
cloud.init()
const collection = new Collection()

class CollectionController {

  async cretaeCollection(event) {
    const [err, data] = await to(collection.queryIsCollection(event.OPENID, event.targetArticle))
    if (err) return {err, res: null}
    if (data && data.length) {
      return {err:'已经收藏过了', res: null}
    }

    const createData = Object.assign({},
      { openId: event.OPENID },
      { targetArticle: event.targetArticle },
      { targetUser: event.targetUser })
      // updateArticle
    const [error, res] = await to(collection.createCollection(createData))
    if (error) return {err: error, res}
    const [articleErr, articleRes] = await to(collection.updateArticleTotal(event.targetArticle, 'add'))
    return {err: error || articleErr, res: {res, articleRes}}
  }

  async delectCollection(event) {
    const openId = event.OPENID
    const targetArticle = event.targetArticle
    const [err, res] = await to(collection.delectCollection(openId, targetArticle))
    if (err) return {err, res}
    const [articleErr, articleRes] = await to(collection.updateArticleTotal(event.targetArticle, 'remove'))
    return {err: err || articleErr, res: res || articleRes}
  }

  async queryUserAllCollection(event) {
    // 如果没有传目标， 则查询当前账户的
    let openId = event.targetUser || event.OPENID
    const [err, res] = await to(collection.queryUserAllCollection(openId))
    if (err) return {err, res}
    // 通过文章id获取文章

    const fuctionList = res.map(async collectionItem => {
      const [error, {result}] = await to(cloud.callFunction({
        name: 'article',
        data: {
          action: 'queryArticlebyId',
          id: collectionItem.targetArticle
        }
      }))
      return result.res
    })

    return {err, res: await Promise.all(fuctionList)}
  }

  // 获取文章所有的收藏者
  async queryArticleAllCollection(event) {
    let targetArticle = event.targetArticle
    const [err, res] = await to(collection.queryArticleAllCollection(targetArticle))
    return {err, res}
  }

  // 查询用户是否已经收藏该文章
  async queryIsCollection(event) {
    const [err, res] = await to(collection.queryIsCollection(event.OPENID, event.targetArticle))
    if (err) return {err, res}
    return { res: res && (!!res.length), err}
  }
}

module.exports = CollectionController