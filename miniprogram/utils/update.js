function getFileformat(path) {
  const strList = path.split('.')
  return '.' + strList[strList.length - 1]
}

function getTimestamp() {
  return (new Date()).getTime()
  let timeStr = (new Date()).toLocaleString('chinese', { hour12: false }) 
  let a = timeStr.replace(/\//g, '-').replace(' ', '-').replace(/:/g, '-')
  return a + '-' + (new Date()).getTime()
}


export async function updateImg(updatedata) {
  const { file = 'article', paths, openId } = updatedata
  const funList = paths.map(path => {
    const timestamp = getTimestamp()
    const fileformat = getFileformat(path)
    return wx.cloud.uploadFile({
      cloudPath: `${file}/${openId}/${timestamp}${fileformat}`,
      filePath: path, // 文件路径
    })
  })

  const res = await Promise.all(funList)
  return res.map(o => o.fileID)
}