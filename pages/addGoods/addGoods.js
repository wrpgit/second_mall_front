// pages/addGoods/addGoods.js
const app = getApp();
Page({

  /**
   * 页面的初始数据   
   */
  data: {
    imgs: ["/image/addGoods/creama.png"],
    tempFilePath: "",
    navbar: [], 
    school: [],
    index: 0,
    schoolIndex: 0,
    name: "",
    desc:"",     //物品描述
    price:"",
    beforeURL:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid == "" || app.globalData.openid == undefined) {
      setTimeout(function () {
        if (app.globalData.openid != "" &&
          app.globalData.openid != undefined) {
          
          app.getOpenid();
        }
      }, 3000)
    }
      this.setData({
        navbar: app.globalData.navbar,
        school: app.globalData.school,
        beforeURL: app.globalData.beforeURL
      })

  },
  onShow: function(){
    if (app.globalData.openid == "" || app.globalData.openid == undefined) {
      app.getOpenid();
    }
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权");

        } else {
          wx.showModal({
            title: '提示',
            content: '请先到我的界面中登陆, 否则无法发布',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.switchTab({
                  url: '../aboutMe/aboutMe', //跳转到授权页面
                })
              }
              else {
                console.log("用户点击取消");
                wx.switchTab({
                  url: '../aboutMe/aboutMe', //跳转到授权页面
                })
              }
            }
          })
        }
      }
    })
  },
  /**选择图片并显示 */
  addImage: function () {
    var that = this;
    let imgs = that.data.imgs;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          imgs: [tempFilePaths, imgs],
          tempFilePath: tempFilePaths[0]
        });
      }
    })
  },
  /**点击预览图片 */
  preView: function () {
    const imgs = this.data.imgs;
    wx.previewImage({
      current: imgs[0],  //当前预览的图片
      urls: imgs[0],//所有要预览的图片
    })
  },
  removeImage: function () {
    let imgs = this.data.imgs;
    this.setData({
      imgs: [imgs[1]]
    })
  },

  /**获取书的输入框中书的名字 */
  goodsName: function (e) {
    var str = app.filterEmoji(e.detail.value);
    this.setData({
      name: str
    })
  },
  /**获取书的输入框中书的描述 */
  goodsDesc: function (e) {
    var str = app.filterEmoji(e.detail.value);
    this.setData({
      desc: str
    })
  },
  /**获取书的输入框中书的价格 */
  goodsPrice: function (e) {
    this.setData({
      price: e.detail.value
    })
  },

  /**提交表单 */
  submitForm: function () {
    var that = this;
    var openid = getApp().globalData.openid;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权");
          
        } else {
          wx.showModal({
            title: '提示',
            content: '请先到我的界面中登陆',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.switchTab({
                  url: '../aboutMe/aboutMe', //跳转到授权页面
                })
              }
              else {
                console.log("用户点击取消");
                wx.switchTab({
                  url: '../aboutMe/aboutMe', //跳转到授权页面
                })
              }
            }
          })
        }
      }
    })
    if (that.data.imgs.length == 1) {
      wx.showModal({
        title: '提示',
        content: '请选择一张图片',
        showCancel: false,
      })
      return;
    }
    else if (that.data.name == '') {
      wx.showModal({
        title: '提示',
        content: '请输入物品的名称',
        showCancel: false,
      })
      return;
    } else if (that.data.desc == '') {
      wx.showModal({
        title: '提示',
        content: '请输入商品的描述',
        showCancel: false,
      })
      return;
    } else if (that.data.price == '') {
      wx.showModal({
        title: '提示',
        content: '请输入商品的价格',
        showCancel: false,
      })
      return;
    }

    wx.uploadFile({
      url: that.data.beforeURL + 'addGoods',
      filePath: that.data.tempFilePath,
      name: 'first',
      formData: {
        openid: getApp().globalData.openid,
        name: that.data.name,
        desc: that.data.desc,
        price: that.data.price,
        kind: that.data.index,
        schoolId: that.data.schoolIndex
      },
      success(res) {
        console.log("信息发布成功");
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          imgs: ["/image/addGoods/creama.png"],
          tempFilePath: "",
          name: "",
          desc: "",
          price: ""
        })
      },
      fail(res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '发布失败，服务器未开启或未上传图片',
          showCancel: false,
          success: function (res) {
            if
            (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    })
  },


  //选择的商品类别更改事件
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  schoolChange: function(e){
    this.setData({
      schoolIndex: e.detail.value
    })
  }
})