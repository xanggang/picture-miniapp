// 云函数入口文件
const cloud = require('wx-server-sdk')
const CollectionController = require('./collectionController.js')
const collectionController = new CollectionController()
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  const { OPENID, APPID } = wxContext
  const { action } = event
  event.openId = OPENID
  console.log(event)

  switch (action) {
    case 'cretaeCollection': {
      return collectionController.cretaeCollection(event)
    };
    case 'delectCollection': {
      return collectionController.delectCollection(event)
    };
    case 'queryUserAllCollection': {
      return collectionController.queryUserAllCollection(event)
    };
    case 'queryArticleAllCollection': {
      return collectionController.queryArticleAllCollection(event)
    };
    case 'queryIsCollection': {
      return collectionController.queryIsCollection(event)
    }
  }
}