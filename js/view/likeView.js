Youai.LikeView = Backbone.View.extend({

  className: 'like-items',

  initialize: function() {
    this.$el.html(JST['template/like_header'](/* need some real data here */))
  },

  render: function() {
    var self = this;

    for (var i = 0; i < this.data.length; i++) {

      if (this.data[i].records && this.data[i].records.length) {

        var goodlist = new Youai.GoodList().reset(this.data[i].records)

        this.$el.append(JST['template/like_section'](this.data[i]))

        new Youai.Waterfall(this.$('.good-list').last(), {
          colWidth: 153,
          load: function(success) {
            var items = [], heights = []

              goodlist.each(function(good) {
                items.push( (new Youai.goodItemView({model: good})).render() )
                heights.push( parseInt(good.height()) + 34)
              })

              success(items, heights);
          }
        })
      }
    }

    lazyload.init();

    Youai.Mod.renderPageNav(this.result.recordTotal)

    $('.separator').last().remove()

  },

  likeDataUrl: function() {
    // return 'json/like.json'
    if (this.options.userId == "currentUser") {
      //return {api:"com.taobao.wap.rest2.wo3",data:{"method":"getItemDetail","itemId":id,"isvCode":isvCode}}
      return {
        api:"com.taobao.wap.rest2.wo3",
        data:{
          "method": "getLikeItems",
          "pageSize": 10,
          "pageNo": this.options.page
        }
      }
    } else {
      return {
        api:"com.taobao.wap.rest2.wo3",
        data:{
          "method": "getOtherLikeItems",
          "pageSize": 10,
          "pageNo": this.options.page,
          "otherUserId": this.options.userId
        }
      }
    }
  },

  getLikeData: function() {
    var self = this
    var url = this.likeDataUrl()

    Youai.mtopH5.getApi(url.api, "1.0", url.data, {},function (json) {
      if (self.options.userId == "currentUser") {
        Youai.Util._checkLogin(json)
      }

      if (json.ret[0].search('SUCCESS') > -1) {
          self.result = json.data.result;
          self.data = json.data.result.data;
          self.render()
      } else {
          console.log('mtop error')
      }

    }, function() {
      console.log('network error')
    })
  }
})