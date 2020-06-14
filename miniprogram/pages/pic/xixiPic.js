// miniprogram/pages/pic/pic.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    // hidden: false,
    collection:'xixi',
    tabList: ['我最美','2020', '2019'],
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    curPageloadCount:0,
    modalHidden: true,
    longClickItemId:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
 

    wx.getSystemInfo( {
 
      success: function( res ) {
        that.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
 
    });

    mCurrentPage=0;
    requestData(that,mCurrentPage)


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
    console.log('onPullDownRefresh')
    // var that=this
    // mCurrentPage=0
    // requestData(that,mCurrentPage)

  },
  onlongclick: function (event) {
    if (event.currentTarget.dataset.url != null){
      console.log('onlongclick ', event.currentTarget.dataset)
      this.setData({ 
        modalHidden: false,
        longClickItemId:event.currentTarget.dataset.id,
       });
    }
   
  },
 
 onDeleteClick: function (event) {
    var that=this
    console.log("onDeleteClick1:"+that.data.longClickItemId );
    that.setData({ modalHidden: true });

      // const db = wx.cloud.database()
      //  db.collection(that.data.collection).doc(that.data.longClickItemId).remove({
      //   success: res => {
      //     wx.showToast({
      //       title: '删除成功',
      //     })
      //   },
      //   fail: err => {
      //     wx.showToast({
      //       icon: 'none',
      //       title: '删除失败',
      //     })
      //     console.error('[数据库] [删除记录] 失败：', err)
      //   }
      //  })

      wx.cloud.callFunction({
        // 云函数名称
        name: 'removePic',
        // 传给云函数的参数
        data: {
          a: that.data.collection,
          b: that.data.longClickItemId,
        },
        success: function(res) {
          console.log(res.result)
               wx.showToast({
             title: '删除成功',
           })
        },
        fail: console.error
      })   
    

},
// 取消
onCancelClick: function (event) {
  this.setData({ modalHidden: true });
},

  lower() {
    var that = this;

    if ( mCurrentPage>0 && that.data.curPageloadCount == 0) {
      wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
        title: '我也是有底线的',
        icon: 'success',
        duration: 300
      });
      return false;
    } else {
      requestData(that, mCurrentPage );
    
    }



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
  swichNav: function( e ) {
 
    var that = this;
 
    if( this.data.currentTab === e.target.dataset.current ) {
      mCurrentPage=0
      requestData(that,mCurrentPage)
      return false;
    } else {
      that.setData( {
        currentTab: e.target.dataset.current
      })
    }
    console.log('tab ', e.target.dataset)


  },
  bindChange: function( e ) {
 
    var that = this;
    that.setData( { currentTab: e.detail.current });
    console.log('tab2 ', e.detail)
    mCurrentPage=0;
    requestData(that, mCurrentPage );

  },
  adddetial: function () {

         var tabList = JSON.stringify(this.data.tabList);
    console.log('tabList ', tabList)


        wx.navigateTo({
    
          url: '../uploadPic/uploadPic?collection='+this.data.collection+ '&tabList=' +tabList+ '&currentTab=' +this.data.currentTab  ,
    
          success: function (res) { },
    
          fail: function (res) { },
    
          complete: function (res) { },
    
        })
    
      },
  

})
var mCurrentPage = 0;

function requestData(that,targetPage){
  wx.showToast({
    title: '加载中',
    icon: 'loading'
  });
  const db = wx.cloud.database()
  db.collection(that.data.collection)
  .where({
    cate: that.data.tabList[that.data.currentTab]
  })
  .skip(mCurrentPage*10)
  .limit(10)
  .get({
    success: res => {
      var allData=res.data
      if(mCurrentPage>=1){
        allData=that.data.items.concat(res.data)

      }

      that.setData({
        items:allData,
        curPageloadCount:res.data.length,
      })
      console.log('[数据库] [查询记录] 成功: ', res)
      mCurrentPage = targetPage+1;
      wx.hideToast();


    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
    },

  })

}