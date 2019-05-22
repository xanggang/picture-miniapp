const cloud = require('wx-server-sdk')
cloud.init()
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
    const res = await db.collection('attention').add({ data: new AttentionBase(data) })
    console.log(res)
    return 1
  }

  async delectAttention(openId, targetUser) {
    try {
      await db.collection('attention')
        .where({
          openId: openId,
          targetUser: targetUser
        })
        .remove()
      return 1
    } catch(e) {
      return {
        err: e
      }
    }
  }

  // 获取用户的全部关注
  async queryUserAllAttention(openId) {
    const { data } = await db.collection('attention')
      .where({ openId: openId })
      .get()
    return data || []
  }

  // 获取关注该用户的所有人
  async queryUserAllFan(openId) {
    const res = await db.collection('attention').where({ targetUser: openId })
    console.log(res)
    return res
  }

  // 查询是否已经关注过该用户
  async queryIsAttention(user, target) {
    const res = await db.collection('attention')
      .where({ openId: user, targetUser: target})
      .get()
    return !!res.data.length
  }
}

module.exports = Attentio