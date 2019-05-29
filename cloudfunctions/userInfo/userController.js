// 云函数入口文件
const User = require('./user.js')
const cloud = require('wx-server-sdk')
const to = require('await-to-js').default;
cloud.init()

class UserController extends User {
  constructor(openId) {
    super(openId)
  }

  // 处理登录
   async handelLogin(event) {
    const { OPENID } = event
    const [err, res] = await to(this.getUserInfo(OPENID))
    if (err) return {err, res}
    if (res) return {err, res}
    if (!event.loginInfo) {
      return {err: '注册用户失败，请先调用wx.userInfo接口', res}
    }
    event.loginInfo.openId = OPENID
    return this.handelCreateUser(event)
  }

  // 注册用户
   async handelCreateUser(event) {
    const { loginInfo, OPENID } = event
    const [err, res] = await to(this.createUser(loginInfo))
    if (err) return {err, res}
    const [_err, _res] = await to(this.getUserInfo(OPENID))
    if (_err) return {err, _res}
    return _res
  }

  // 通过openId查询用户
  async queryUserByOpenid(event) {
    const { targetUser, OPENID} = event
    // 如果没有传openId进来， 就查询当前用户
    const seatchOpenId = targetUser || OPENID
    const [err, res] = await to(this.getUserInfo(seatchOpenId))
    if (err) return {err, res}
    // 查询是否关注过该用户
    if (res && targetUser) {
      const [error, { result }] = await to(cloud.callFunction({
        name: 'attention',
        data: {
          action: 'queryIsAttention',
          currentUser: OPENID,
          targetUser: targetUser
        }
      }))
      if (error) return {err: error, res: result}
      res.isAttention = result.res
    }
    return {
      res: res,
      err: null
    }
  }

  // // 查询当前用户
  // async queryCurrUser(event) {
  //   const { openId } = event.userInfo
  //   const _user = await this.getUserInfo(openId)

  //   return _user
  // }

}

module.exports = UserController