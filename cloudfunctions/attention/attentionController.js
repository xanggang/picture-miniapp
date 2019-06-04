const Attention = require('./attention.js')
const to = require('await-to-js').default;
const cloud = require('wx-server-sdk')
cloud.init({ env: 'prod-4ygqk'})
const attention = new Attention()

class AttentionController {

  async cretaeAttention(event) {
    const { OPENID, targetUser } = event
    const [err, isAttentio] = await to(attention.queryIsAttention(OPENID, targetUser))
    if (err) return {err, res: isAttentio}
    if (isAttentio) return {err: '已经关注过该用户了', res: null}

    const createData = Object.assign({}, { openId: OPENID, targetUser })

    const [error, res] = await to(attention.createAttention(createData))
    return  {err: error, res}
  }

  async delectAttention(event) {
    const openId = event.openId
    const targetUser = event.targetUser
    const [err, res] = await to(attention.delectAttention(openId, targetUser))
    return {err, res}
  }

  async queryUserAllAttention(event) {
    // 如果没有传目标， 则查询当前账户的
    let openId = event.targetUser ? event.targetUser : event.openId
    const [err, res] = await to(attention.queryUserAllAttention(openId))
    return {err, res}
  }

  async queryUserAllFan(event) {
    let openId = event.targetUser ? event.targetUser : event.openId
    const [err, res] = await to(attention.queryUserAllFan(openId))
    return {err, res}
  }

  async queryIsAttention(event) {
    const [err, isAttentio] = await to(attention.queryIsAttention(event.currentUser, event.targetUser))
    return {err, res: isAttentio}
  }
}

module.exports = AttentionController