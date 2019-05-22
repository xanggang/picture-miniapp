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
    console.log('handelLogin', _user)
    if (_user.length) return { err: null, res: _user[0] }
    else return this.handelCreateUser(event)
  }

   async handelCreateUser(event) {
    //  return event
    //  console.log('handelCreateUser', event)
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

  async queryUserByOpenid(event) {
    const { openId } = event
    const res = await this.getUserInfo(openId)
    return res
  }

  async queryCurrUser(event) {
    const { openId } = event.userInfo
    const _user = await this.getUserInfo(openId)

    return _user
  }

}

module.exports = UserController