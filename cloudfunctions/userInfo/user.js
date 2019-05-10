const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

class User {
  constructor(openid) {
    this.openid = openid
  }

  async getUserInfo () {
    const { data } = await db.collection('user').where({ openid: this.openid })
      .get()
    return data
  }
  
  async createUser (userInfo) {
    const { data } = await db.collection('user').where({ openid: this.openid })
      .get()
      if ( data.length ) {
        return Promise.reject({err: '该用户已存在'})
      }
      const res = await db.collection('user').add

  }
}

module.exports = User