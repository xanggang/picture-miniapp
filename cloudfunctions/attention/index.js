// 云函数入口文件
const cloud = require('wx-server-sdk')
const AttentionController = require('./attentionController.js')
const attentionController = new AttentionController()
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  const { OPENID, APPID } = wxContext
  const { action } = event
  event.OPENID = OPENID

  console.log(event)


  switch (action) {
    case 'cretaeAttention': {
      return attentionController.cretaeAttention(event)
    };
    case 'delectAttention': {
      return attentionController.delectAttention(event)
    };
    case 'queryAttentioList': {
      return attentionController.queryUserAllAttention(event)
    };
    case 'queryUserAllFan': {
      return attentionController.queryUserAllFan(event)
    };
    case 'queryIsAttention': {
      return attentionController.queryIsAttention(event)
    }
  }
}