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
  event.openId = OPENID
  switch (action) {
    case 'cretaeAttention': {
      return attentionController.cretaeAttention(event)
    };
  }
}