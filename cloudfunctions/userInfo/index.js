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
  const { action } = event



  switch (action) {
    case 'login': {
      return handelLogin(event, user)
    };
    case 'createUser': {
      return handelCreateUser(event, user)
    }
  }
}

async function  handelLogin(event, user) {
  const _user = await user.getUserInfo()
  if (_user.length) return { err: null, res: _user[0]}
  else return handelCreateUser(event, user)
  return 
}

async function handelCreateUser(event, user) {
  const { loginInfo, userInfo } = event
  loginInfo.appId = userInfo.appId
  loginInfo.openId = userInfo.openId
  let err = null
  const crearedUserRes = await user.createUser(loginInfo)
    .catch(e => {
      err = e
    })
  
  return {
    res: crearedUserRes,
    err
  }
}