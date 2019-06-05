const cloud = require('wx-server-sdk')
cloud.init({ env: 'prod-4ygqk'})
const to = require('await-to-js').default;
const db = cloud.database()

class UserBase {
  constructor(data) {
    this.openId = data.openId
    this.avatarUrl = data.avatarUrl
    this.city = data.city
    this.country = data.country
    this.gender = data.gender
    this.language = data.language
    this.nickName = data.nickName
    this.province = data.province
    this.signature = null // 签名 
    this.watchList = [] // 关注列表
    this.releaseList = [] // 发布列表
    this.createTime = db.serverDate()
    this.userStatus = 0 // 用户状态 0 正常 1 限制登录
    this.inviteUser = null
  }
}

class User {
  constructor(openId) {
    this.openId = openId
  }

  // 获取用户信息
  async getUserInfo(openId) {
    const [err, {data}] = await to(db.collection('user')
      .where({ openId: openId })
      .get())
    if (err) return Promise.reject(err.errMsg)
    if (Array.isArray(data) && data.length) return data[0]
    else return null
  }

  // 创建新用户
  async createUser (userInfo) {
    let [err, res] = await to(db.collection('user').add({ data: new UserBase(userInfo)}))
    if (err) return Promise.reject(err.errMsg)
    return res._id
  }
}

module.exports = User