Youai.DetailView = Backbone.View.extend({

  events: {

  },

  initialize: function() {
    $('h1.title').text('详情页')

    this.items = {}
  },

  itemUrl: function() {
    return 'http://api.waptest.taobao.com/rest/api2.do?api=com.taobao.wap.rest2.wo3&type=jsonp&callback=jsonp1&v=*&source=wo&sid=83fb97e85b9c12374f8b8426e5d564d8&data={"method":"getItemDetail","srcType":"10","srcCode":"1","isvCode":"12","itemId":"12121"}'
  },

  getItemData: function() {
    var self = this
    $.ajax({
      url: this.itemUrl(),
      dataType: 'jsonp',
      callback: 'jsonp1',
      success: function(json) {
        if (json.ret[0].search('SUCCESS') > -1) {
          self.items[json.data.result.itemId] = new Youai.Item(json.data.result)
          self.displayItem(json.data.result.itemId)
        } else {
          alert('error')
        }
      },
      error: function() { 
        console.log('error')
      }
    })
  },

  displayItem: function(id) {
    if (!this.items[id]) {
      this.getItemData(id)
      return
    }

    // show the item

  }

})