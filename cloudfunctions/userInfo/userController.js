// 云函数入口文件
const User = require('./user.js')
const cloud = require('wx-server-sdk')
cloud.init()

class UserController extends User {
  constructor(openId) {
    super(openId)
  }

   async handelLogin(event) {
    const wxContext = cloud.getWXContext()
    const { OPENID } = wxContext
    event.loginInfo.openId = OPENID
    const _user = await this.getUserInfo(OPENID)
    if (_user.length) return { err: null, res: _user[0] }
    else return this.handelCreateUser(event)
  }

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
    const { openId, targetUserUserId } = event
    const res = await this.getUserInfo(openId)
    // 查询是否关注过该用户
    if (res && targetUser) {
      const { result } = await wx.cloud.callFunction({
        name: 'attention',
        data: {
          action: 'queryIsAttention',
          currentUserId: openId,
          targetUser: targetUserUserId
        }
      })
      res.isAttention = result
    }
    return res
  }

  // 查询当前用户
  async queryCurrUser(event) {
    const { openId } = event.userInfo
    const _user = await this.getUserInfo(openId)

    return _user
  }

}

module.exports = UserController