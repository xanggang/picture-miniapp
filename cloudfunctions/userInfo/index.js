// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const UserController = require('./userController.js')


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID, APPID } = wxContext

  const user = new UserController(OPENID)
  const { action } = event
  console.log('userevent', event)

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
    case 'queryCurrUser': {
      return user.queryCurrUser(event)
    }
  }
}