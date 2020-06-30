// pages/updateGoods/updateGoods.js
const app = getApp();
Page({

  data: {
    imgs: ["/image/addGoods/creama.png"],
    tempFilePath: "",
    navbar: [],
    school: [],
    index: 0,     //navbar的序列号
    schoolIndex: 0,
    name: "",
    desc: "",     //物品描述
    price: "",
    goodsId:"",
    beforeURL: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let imgs = that.data.imgs;
    this.setData({
      goodsId: options.goodsId,
      navbar: app.globalData.navbar,
      school: app.globalData.school,
      beforeURL: app.globalData.beforeURL
    })
    wx.request({
      url: that.data.beforeURL + 'getGoodsDetail',
      data: {
        goodsId: that.data.goodsId
      },
      success: function (res) {
        console.log(res);
        that.setData({
          index: res.data.kindId,
          schoolIndex: res.data.schoolId,
          name: res.data.goodsName,
          desc: res.data.description,
          price: res.data.price,
          imgs: [res.data.goodsImage, imgs],
        })
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
  // removeImage: function () {
  //   let imgs = this.data.imgs;
  //   this.setData({
  //     imgs: [imgs[1]]
  //   })
  // },


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
     if (that.data.name == '') {
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
    wx.request({
      url: that.data.beforeURL + 'updateGoods',
      data:{
        goodsId: that.data.goodsId,
        name: that.data.name,
        description: that.data.desc,
        price: that.data.price,
        schoolId: that.data.schoolIndex,
        kindId: that.data.index
      },
      success(res) {
        console.log(res);
        //console.log("信息修改成功");
        if(res.data.status == "200"){
       
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          var pages = getCurrentPages();
          var beforePage = pages[pages.length - 2];
          beforePage.changeData(that.data.goodsId);
          wx.navigateBack({
            delta: 1,
          })
        }
      }
    })
    
  },


  //选择的商品类别更改事件
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  schoolChange: function (e) {
    this.setData({
      schoolIndex: e.detail.value
    })
  }
 
})