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

  async createAttentio(data) {
    const res = await db.collection('attention').add({ data: new AttentionBase(data) })
    console.log(res)
    return 1
  }

  async delectAttentio(id) {
    try {
      await db.collection('attention').doc(id).remove()
      return 1
    } catch(e) {
      return {
        err: e
      }
    }
  }

  // 获取用户的全部关注
  async queryUserAllAttentio(openId) {
    const res = await db.collection('attention').where({ openId: openId })
    console.log(res)
    return res
  }

  // 获取关注该用户的所有人
  async queryUserAllFan(openId) {
    const res = await db.collection('attention').where({ targetUser: openId })
    console.log(res)
    return res
  }
}