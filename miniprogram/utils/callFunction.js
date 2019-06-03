
export default async function({name, action, data}) {
    const { result } = await wx.cloud.callFunction({
        name: name,
        data: {
            action,
            ...data
        }
    })
    if (result.err) {
        wx.showToast({
            title: result.err
        })
        return Promise.reject(result.err)
    }
    console.log(result)
    return result.res
}