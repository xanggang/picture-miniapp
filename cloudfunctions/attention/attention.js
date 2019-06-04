const cloud = require('wx-server-sdk')
cloud.init({ env: 'prod-4ygqk'})
const to = require('await-to-js').default;
const db = cloud.database()

class AttentionBase {
  constructor(data) {
    this.openId = data.openId
    this.targetUser = data.targetUser
    this.targetArticle = data.targetArticle
    this.createTime = db.serverDate()
  }
}

class Attentio {

  async createAttention(data) {
    const [err, res] = await to(db.collection('attention').add({ data: new AttentionBase(data) }))
    if (err) return Promise.reject('添加关注失败')
    return res._id
  }

  async delectAttention(openId, targetUser) {
    const [err, res] = await to(db.collection('attention')
      .where({
        openId: openId,
        targetUser: targetUser
      })
      .remove())
      if (err) return Promise.reject('取消关注失败')
      return res
  }

  // 获取用户的全部关注
  async queryUserAllAttention(openId) {
    const [err, { data }] = await to(db.collection('attention')
      .where({ openId: openId })
      .get())
    if (err) return Promise.reject('查询失败')
    return data
  }

  // 获取关注该用户的所有人
  async queryUserAllFan(openId) {
    const [err, {data}] = await to(db.collection('attention').where({ targetUser: openId }).get())
    if (err) return Promise.reject('查询失败')
    return data
  }

  // 查询是否已经关注过该用户
  async queryIsAttention(user, target) {
    const [err, {data}] = await to(db.collection('attention')
      .where({ openId: user, targetUser: target})
      .get())
    if (err) return Promise.reject('查询失败')
    return data && !!data.length
  }
}

module.exports = Attentio