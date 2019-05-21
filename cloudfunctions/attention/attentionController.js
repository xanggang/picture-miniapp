const Attention = require('./attention.js')
const cloud = require('wx-server-sdk')
cloud.init()
const attention = new Attention()

class AttentionController {

  async cretaeAttention(event) {
    const createData = Object.assign({},
      { openId: event.openId },
      event.data
    )
    const res = await attention.cretaeAttention(createData)
    return res
  }

  async delectAttentio(event) {
    const id = event.id
    const res = await attention.delectAttentio(id) 
    return id
  }

  async queryUserAllAttentio(event) {
    // 如果没有传目标， 则查询当前账户的
    let openId = event.targetUser ? event.targetUser : event.openId
    const res = await attention.queryUserAllAttentio(openId)
    return res
  }

  async queryUserAllFan(event) {
    let openId = event.targetUser ? event.targetUser : event.openId
    const res = await attention.queryUserAllFan(openId)
    return res
  }
  
}