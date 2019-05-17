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

  async queryUserAlltAttentio(openId) {

  }
}