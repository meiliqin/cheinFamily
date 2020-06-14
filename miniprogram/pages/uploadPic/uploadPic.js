// miniprogram/pages/uploadPic/uploadPic.js
const app = getApp()
const db = wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbox: [],//选择图片
    fileIDs: [],//上传云存储后的返回值
    cateList: [],
    collection:'',
    currentCate:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('tabList2 ', options.tabList)

    var tabList = JSON.parse(options.tabList)
    

    this.setData({
      collection: options.collection,
      cateList:tabList,
      currentCate:tabList[options.currentTab],
     

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 删除照片 &&
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 选择图片 &&&
  addPic1: function (e) {
    var imgbox = this.data.imgbox;
    console.log(imgbox)
    var that = this;
    var n = 5;
    if (5 > imgbox.length > 0) {
      n = 5 - imgbox.length;
    } else if (imgbox.length == 5) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (5 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },

  //图片
  imgbox: function (e) {
    this.setData({
      imgbox: e.detail.value
    })
  },


  //发布按钮
  fb: function (e) {
    if (!this.data.imgbox.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
        //上传图片到云存储
        wx.showLoading({
          title: '上传中',
        })
        let promiseArr = [];
        for (let i = 0; i < this.data.imgbox.length; i++) {
          promiseArr.push(new Promise((reslove, reject) => {
            let item = this.data.imgbox[i];
            let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
            wx.cloud.uploadFile({
              cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
              filePath: item, // 小程序临时文件路径
              success: res => {
                this.setData({
                  fileIDs: this.data.fileIDs.concat(res.fileID)
                });
                console.log(res.fileID)//输出上传后图片的返回地址
                const db = wx.cloud.database();
                db.collection(this.data.collection).add({
                  data:{
                    fileID:res.fileID,
                    cate:this.data.currentCate,
                  }
                })
                reslove();
                wx.hideLoading();
                wx.showToast({
                  title: "上传成功",
                })
              },
              fail: res=>{
                wx.hideLoading();
                wx.showToast({
                  title: "上传失败",
                })
              }

            })
          }));
        }
        Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
          console.log("图片上传完成后再执行")
          this.setData({
            imgbox:[]
          })
        })

      }
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.currentCate=this.data.cateList[e.detail.value];
    console.log('currentSubCate值为', this.data.currentCate)
    this.setData({
      index: e.detail.value
    })
  },
})