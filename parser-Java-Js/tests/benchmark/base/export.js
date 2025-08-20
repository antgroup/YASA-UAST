const config = require('./config.js');
const emsmd5sign = require('./emsmd5sign.js');
const getInfoByOpenId_url = config.getInfoByOpenId_url;
//返回广东用户中心信息
export function getUserCenterInfo() {
  return new Promise((resolve, reject) => {
    var timestamp = (new Date()).valueOf();
    var object = {};
    object['openId'] = my.getStorageSync({ key: 'userId' }).data;
    object['timestamp'] = timestamp;
    var signstr = emsmd5sign.signjs(object);
    my.request({
      url: getInfoByOpenId_url,
      method: 'POST',
      data: {
        openId: my.getStorageSync({ "key": 'userId' }).data,
        timestamp: timestamp,
        sign: signstr
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded'  //默认值
      },
      dataType: 'json',
      success: response => {
        if (response.data.errCode == '1') {
          resolve(response.data)
        } else {
          reject(response.data)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
