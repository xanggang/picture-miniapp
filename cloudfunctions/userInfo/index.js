// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const User = require('./user.js')

// const 

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID, APPID } = wxContext

  const user = new User(OPENID)
  const userInfo = await user.getUserInfo()
  return {
    userInfo: userInfo,
    user: user
  }
}