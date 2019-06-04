const cloud = require('wx-server-sdk')
cloud.init({ env: 'prod-4ygqk'})
const to = require('await-to-js').default;
const db = cloud.database()
const _ = db.command

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
  // 添加新的文章
  async createArticle(data) {
    const [ err, res ] = await to(db.collection('article').add({ data: new ArticleBase(data) }))
    if (err) return Promise.reject(err.errMsg)
    else return res._id
  }

  async queryArticlebyId(id) {
    const [err, { data }] = await to(db.collection('article').where({ _id: id }).get())
    if (err) return Promise.reject(err.errMsg)
    return data[0]
  }

  async queryArticleByOpenId({ size, page, openId }) {
    const [err, { data } ]= await to(db.collection('article')
      .where({
        openId: openId, // 填入当前用户 openid
      })
      .orderBy('createTime', 'desc')
      .skip(size * page) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(size) // 限制返回数量为 10 条
      .get())
    if (err) return Promise.reject(err.errMsg)
    return data
  }

  async queryArticleAll({ size, page, orderBy, sort}) {
    const [err, { data }] = await to(db.collection('article')
      // .orderBy('recommend', 'desc')
      .orderBy(orderBy, sort)
      .skip(10 * page) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(size) // 限制返回数量为 10 条
      .get())
    if (err) return Promise.reject(err.errMsg)
    return data
  }

  async deleteArticle(id) {
    const [err, res] =  await to(db.collection('article').doc(id).remove())
    if (err) return Promise.reject(err.errMsg)
    return res
  }
  
  // 查询是否已经收藏过改文章
  async queryIsCollection(user, targetArticle) {
    const [err, {data}] = await to(db.collection('collection')
      .where({ openId: user, targetArticle: targetArticle })
      .get())
    if (err) return Promise.reject(err.errMsg)
    return !!data.length
  }

  // 点赞
  async updateRecommend(targetArticle) {
    const [err, res] = await to(db.collection('article').doc(targetArticle).update({
      data: {
        recommend: _.inc(1)
      }
    }))
   return {err,res}
  }
}

module.exports = Article