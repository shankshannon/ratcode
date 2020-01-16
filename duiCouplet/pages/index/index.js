Page({
  data: {
    output: '',
    enter: 'enter here'
  },
  formSubmit: function (e) {
    var upper = JSON.stringify(e.detail.value["enter"])
    var str_upper = upper.replace(/\"/g, "")
    console.log(str_upper)

    var urlTest = 'http://mangying4py.com:5000/?upper=' + str_upper
    console.log(urlTest)

    var that = this
    wx.request({
      url: 'http://mangying4py.com:5000/?upper=' + str_upper,
      'Content-Type': 'application/json',
      method: "GET",
      success: function (res) {
          that.setData({
            output: res.data
          })
      },
      fail: function () {

      },
      complete: function () {

      }
    })
  },
  onLoad: function () {
    // var that = this
    // wx.request({
    //   url: 'http://23.97.66.223/?upper=' + e.detail.value,
    //   'Content-Type': 'json',
    //   method: "GET",
    //   success: function (res) {
    //     console.log(res.data.message),
    //       that.setData({
    //         output: res.data
    //       })
    //   },
    //   fail: function () {

    //   },
    //   complete: function () {

    //   }
    // })
  }
})