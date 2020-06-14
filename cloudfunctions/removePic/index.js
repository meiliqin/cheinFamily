// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()



const db = cloud.database()
// const _ = db.command

exports.main =  async(event, context) => {
  const wxContext = cloud.getWXContext()
var collection=event.a
var picId=event.b
var removeResult=false
console.log('removePic1', collection)
  await db.collection(collection).doc(picId).remove({
    data: picId,
    success(res) { //成功打印消息
      console.log('removePic', res)
      removeResult=true
    },
    fail(res) { //存入数据库失败
      console.log('removePic失败');
      removeResult=false
  
    }

  })


  return {
    collection:event.a,
    picId:event.b,
   openid: wxContext.OPENID,
   removeResult:removeResult
  }
}