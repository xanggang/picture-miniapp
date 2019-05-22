// 云函数入口文件
const cloud = require('wx-server-sdk')
const ArticleController = require('./articleController.js')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID, APPID } = wxContext

  const articleController = new ArticleController(OPENID)
  event.openId = OPENID
  const { action } = event

  console.log('event', event)

  switch (action) {
    case 'createArticle': {
      return articleController.createArticle(event)
    };
    case 'queryArticlebyId': {
      return articleController.queryArticlebyId(event)
    };
    case 'queryArticleByOpenId': {
      return articleController.queryArticleByOpenId(event)
    };
    case 'queryArticleAll': {
      return articleController.queryArticleAll(event)
    }
  }
}