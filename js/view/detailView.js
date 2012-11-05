Youai.DetailView = Backbone.View.extend({

  className: 'detail',

  events: {

  },

  initialize: function() {
    $('h1.title').text('详情页')

    // $('#J_Main').trigger('datail:comment')
  },

  render: function(template) {
    var content = template(this.data)
    this.$el.html(content)
  },

  itemUrl: function(id) {
    //return 'http://api.waptest.taobao.com/rest/api2.do?api=com.taobao.wap.rest2.wo3&type=jsonp&callback=jsonp1&v=*&source=wo&sid=83fb97e85b9c12374f8b8426e5d564d8&data={"method":"getItemDetail","srcType":"10","srcCode":"1","isvCode":"12","itemId":"12121"}'
    return 'json/detail-single.json'    
  },

  getItemData: function(id) {
    var self = this
    $.ajax({
      url: this.itemUrl(id),
      dataType: 'json',
      success: function(json) {
        if (json.ret[0].search('SUCCESS') > -1) {
          self.data = json.data.result
          self.displayItem(id)
        } else {
          alert('error')
        }
      },
      error: function() { console.log('error') }
    })
  },

  displayItem: function(id) {

    if (!this.data) {
      this.getItemData()
      return;
    }

    console.log(this.data)

    if (this.data.album) {  //有专辑
      this.render(JST['template/detail_collection'])
    } else {  // 无专辑
      this.render(JST['template/detail_single'])
    }

  }

})