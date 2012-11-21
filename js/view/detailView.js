Youai.DetailView = Backbone.View.extend({

  className: 'detail',

  events: {
    'click .comment-count': 'showComemnts',
    'click .vslide li': 'displayAnotherItem'
  },

  initialize: function() {
    $('h1.title').text('详情页')
  },

  render: function(template) {
    var content = template(this.data)
    this.$el.html(content)
  },

  itemUrl: function(id) {
    //return 'http://api.waptest.taobao.com/rest/api2.do?api=com.taobao.wap.rest2.wo3&type=jsonp&callback=jsonp1&v=*&source=wo&sid=83fb97e85b9c12374f8b8426e5d564d8&data={"method":"getItemDetail","srcType":"10","srcCode":"1","isvCode":"12","itemId":"12121"}'
    return 'json/detail-collection.json'
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
          console.log('mtop error')
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

    if (this.data.album) {  //有专辑
      this.render(JST['template/detail_collection'])
      this.slide = new Swipe($('.vslide')[0], { vertical: true, preload: 4 })
      this.slide.load()
    } else {  // 无专辑
      this.render(JST['template/detail_single'])
    }

  },

  displayAnotherItem: function(e) {
    $('.vslide li').removeClass('selected')
    $(e.currentTarget).addClass('selected')

    var index = parseInt($(e.currentTarget).attr('data-index'))
    var item  = this.data.album.items[index]

    // 更新大图
    $('.big-pic img').attr('src', item.images[0].url)

    // 更新价格
    $('.main-view .price').text('￥' + item.originalPrice)

    // 更新评论数
    if (parseInt(item.commentNum) > 0) $('.comment-count strong').text(item.commentNum)

    // 更新喜欢UI
    $('.like-count strong').html(item.likeNum);
    if (item.like == "true") $('.like-count span').addClass('liked')
    else $('.like-count span').removeClass('liked')

    // 更新ISV信息
    $('h1 .isv').attr('href', item.isvInfo.url)
    $('h1 .isv-name').text(item.isvInfo.name)

    // 更新商品描述
    $('h1 .description').text(item.description)

    // TODO 更新详情页链接

    // 更新标签
    $('.recommendations').empty().html(JST['template/detail_tags'](item))

    Youai.router.navigate('!detail/' + item.itemId)
  },

  showComemnts: function() {
    new Youai.commentsView({
        //commentUrl:Youai.Util._devParseUrl("getItemComments.json", {"itemId":111, "pageSize":"10", "pageNo":"1"})
        commentUrl:Youai.Util.parseUrl({"method":"getItemComments","itemId":"1605745989","pageSize":"10","pageNo":"1","isvCode":"25"},"83fb97e85b9c12374f8b8426e5d564d8")
    });
  }

})