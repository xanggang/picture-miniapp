// 云函数入口文件
const cloud = require('wx-server-sdk')
const CollectionController = require('./collectionController.js')
const collectionController = new CollectionController()
cloud.init({ env: 'prod-4ygqk'})

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  const { OPENID, APPID } = wxContext
  const { action } = event
  event.OPENID = OPENID
  
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