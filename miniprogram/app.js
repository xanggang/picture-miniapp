import promisify, { getSetting, getUserInfo, sleep } from './utils/promisify.js'

App({
  globalData: {
    userInfo: {},
    isLogin: false,
    isRegister: false
  },
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      await wx.cloud.init({
        traceUser: true,
      })
    }
  },
  async login() {
    if (this.isLogin) {
      return Promise.resolve(this.globalData.userInfo)
    }
    let userInfo = null
    const userSetting = await getSetting()
    if (userSetting.authSetting['scope.userInfo']) {
      userInfo = await getUserInfo()
      console.log('userInfo')
      const { result } = await wx.cloud.callFunction({
        name: 'userInfo',
        data: {
          action: 'login',
          loginInfo: userInfo.userInfo,
        }
      })
      console.log(' userInfo.userInfo', result)
      this.globalData = {
        user: result.res,
        isLogin: true
      }
      return result.res
    }

    this.globalData = {
      user: null,
      isLogin: false
    }
    return Promise.reject()
  }
})
