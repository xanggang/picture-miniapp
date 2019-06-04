// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'prod-4ygqk'})
const db = cloud.database()
const UserController = require('./userController.js')


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID, APPID } = wxContext
  event.OPENID = OPENID

  const user = new UserController(OPENID)
  const { action } = event

  switch (action) {
    case 'login': {
      return user.handelLogin(event)
    };
    case 'createUser': {
      return user.handelCreateUser(event)
    };
    case 'queryUserByOpenid': {
      return user.queryUserByOpenid(event)
    };
    // case 'queryCurrUser': {
    //   return user.queryCurrUser(event)
    // }
  }
}