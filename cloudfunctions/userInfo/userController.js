// 云函数入口文件
const User = require('./user.js')

class UserController extends User {
  constructor(openId) {
    super(openId)
  }

   async handelLogin(event) {
    const { openId } = event.userInfo
    const _user = await this.getUserInfo(openId)
    if (_user.length) return { err: null, res: _user[0] }
    else return this.handelCreateUser(event)
  }

   async handelCreateUser(event) {
    const { loginInfo, userInfo } = event
    loginInfo.appId = userInfo.appId
    loginInfo.openId = userInfo.openId
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

  async queryUserByOpenid(event) {
    const { openId } = event
    const res = await this.getUserInfo(openId)
    return res
  }
}

module.exports = UserController