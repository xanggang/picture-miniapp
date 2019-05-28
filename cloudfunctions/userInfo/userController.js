// 云函数入口文件
const User = require('./user.js')
const cloud = require('wx-server-sdk')
cloud.init()

class UserController extends User {
  constructor(openId) {
    super(openId)
  }

  // 处理登录
   async handelLogin(event) {
    const { OPENID } = event
    const _user = await this.getUserInfo(OPENID)
     if (_user.length) {
       return { err: null, res: _user[0] }
     } 
     if (!event.loginInfo) {
       return {err: '注册用户失败，请先调用wx.userInfo接口'}
     }
     event.loginInfo.openId = OPENID
     return this.handelCreateUser(event)
  }

  // 注册用户
   async handelCreateUser(event) {
    const { loginInfo } = event
    let err = null
    const crearedUserRes = await this.createUser(loginInfo)
      .catch(e => {
        err = e
      })
    return {
      res: crearedUserRes,
      err
    }
  }

  // 通过openId查询用户
  async queryUserByOpenid(event) {
    const { targetUser, OPENID} = event
    // 如果没有传openId进来， 就查询当前用户
    const seatchOpenId = targetUser || OPENID
    const res = await this.getUserInfo(seatchOpenId)
    // 查询是否关注过该用户
    if (res && targetUser) {
      const { result } = await cloud.callFunction({
        name: 'attention',
        data: {
          action: 'queryIsAttention',
          currentUserId: OPENID,
          targetUser: targetUser
        }
      })
      res.isAttention = result
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