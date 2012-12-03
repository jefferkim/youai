Youai.LikeView = Backbone.View.extend({

  className: 'like-items',

  initialize: function() {
    //add by jinjianfeng
    $("#J-mask").hide();
    $("#J-tplComment").remove();
    this.$el.html('<div class="loading"><span></span></div>')

    this.isCurrentUser = (this.options.userId == "currentUser") // used in likeDataUrl method

  },

  render: function() {
    var self = this

    this.isCurrentUser = (this.result.current == "true") || (this.options.userId == "currentUser")

    if (this.isCurrentUser) $('h1.title').text('我的喜欢')
    else $('h1.title').text('TA 的喜欢')

    if (this.data.length == 0) {
      this.$el.html( JST['template/no_like']({isCurrentUser: this.isCurrentUser, user: this.user}) )
      return;
    }

    this.$el.html(JST['template/like_header']({
      total: this.result.totalLikeNum,
      isCurrentUser: this.isCurrentUser,
      user: this.user
    }))

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

    this.$el.append('<div id="J-pageNav" class="c-pnav-con"></div>')

    Youai.Mod.renderPageNav(this.result.recordTotal,10)

    $('.separator').last().remove()

  },

  likeDataUrl: function() {
    // return 'json/like.json'
    if (this.isCurrentUser) {
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

      if (self.isCurrentUser && !Youai.Util._checkLogin(json)) return

      if (json.ret[0].search('SUCCESS') > -1) {
          self.result = json.data.result;
          self.data = json.data.result.data;
          self.user = json.data.result.user;
          self.render()
      } else {
          console.log('mtop error')
          notification.flash('加载失败，请刷新页面重试').show()
      }

    }, function() {
      console.log('network error')
      notification.flash('加载失败，请刷新页面重试').show()
    })
  }
})