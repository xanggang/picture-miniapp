const Attention = require('./attention.js')
const cloud = require('wx-server-sdk')
cloud.init()
const attention = new Attention()

class AttentionController {

  async cretaeAttention(event) {
    const { OPENID, data } = event
    const isAttentio = await attention.queryIsAttention(OPENID, data.targetUser)
    if (isAttentio) {
      return {
        err: '已经关注过该用户了'
      }
    }

    const createData = Object.assign({},
      { openId: OPENID },
      data
    )
    const res = await attention.createAttention(createData)
    return res
  }

  async delectAttention(event) {
    const openId = event.openId
    const targetUser = event.targetUser
    const res = await attention.delectAttention(openId, targetUser) 
    return res
  }

  async queryUserAllAttention(event) {
    // 如果没有传目标， 则查询当前账户的
    let openId = event.targetUser ? event.targetUser : event.openId
    const res = await attention.queryUserAllAttention(openId)
    return res
  }

  async queryUserAllFan(event) {
    let openId = event.targetUser ? event.targetUser : event.openId
    const res = await attention.queryUserAllFan(openId)
    return res
  }

  async queryIsAttention(event) {
    const isAttentio = await attention.queryIsAttention(event.currentUserId, event.targetUserUserId)
    return isAttentio
  }
}

module.exports = AttentionController