const cloud = require('wx-server-sdk')
const path = require('path')
cloud.init()
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
    const { data } = await db.collection('user')
      .where({ openId: openId })
      .get()
    return data
  }

  // 创建新用户， 并且返回该用户
  async createUser (userInfo) {
    const res = await db.collection('user').add({ data: new UserBase(userInfo)})
    const user = await db.collection('user').where({ _id: res._id })
      .get()
    return user.data[0]
  }
}

module.exports = User