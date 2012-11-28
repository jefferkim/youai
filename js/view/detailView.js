Youai.DetailView = Backbone.View.extend({

  className: 'detail',

  events: {
    'click .comment-count': 'showComemnts',
    'click .vslide li': 'displayAnotherItem',
    'click .big-pic': 'showImageSlide'
  },

  initialize: function() {
    $('h1.title').text('详情页')
  },


  getValidImage: function(images) {
    return _.filter(this.data.images, function(img) { return img.type ==  '0' })[0]
  },

  render: function(template) {

    var content = template( $.extend(this.data, { img: this.getValidImage(this.data.images) }) )
    this.$el.html(content)
  },

  itemUrl: function(id,isvCode) {
    //return 'http://api.waptest.taobao.com/rest/api2.do?api=com.taobao.wap.rest2.wo3&type=jsonp&callback=jsonp1&v=*&source=wo&sid=83fb97e85b9c12374f8b8426e5d564d8&data={"method":"getItemDetail","srcType":"10","srcCode":"1","isvCode":"12","itemId":"12121"}'

    return {api:"com.taobao.wap.rest2.wo3",data:{"method":"getItemDetail","itemId":id,"isvCode":isvCode}};
  },

  getItemData: function(id,isvCode) {
      var self = this;
      var url = this.itemUrl(id,isvCode);

      Youai.mtopH5.getApi(url.api, "1.0", url.data, {},function (json) {

        if (json.ret[0].search('SUCCESS') > -1) {
            self.data = json.data.result
            self.currentItemImages = self.data.images;
            self.currentItemLikeNum = self.data.likeNum;
            self.likeCurrentItem    = self.data.like == 'true';
            self.displayItem(id, isvCode)
          } else {
            console.log('mtop error')
          }
      });

  },

  displayItem: function(id,isvCode) {

    if (!this.data) {
      this.getItemData(id,isvCode)
      return;
    }
    //added by jinjianfeng, for comments
    YA_GLOBAL.itemId = this.data.itemId;
    YA_GLOBAL.isvCode = this.data.isvInfo.isvCode;

    if (this.data.album && this.data.album.items) {  //有专辑
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
    $('.big-pic img').attr('src', this.getValidImage(item.images).url )

    // 更新价格
    $('.main-view .price a').text('￥' + (item.originalPrice / 100).toFixed(2) )

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

    // 更新详情页链接
    var itemLink = 'http://a.m.taobao.com/i' + item.itemId + '.htm'
    $('.price a').attr('href', itemLink)
    $('.go-buy a').attr('href', itemLink)
    $('h1 .description').attr('href', itemLink)

    // 更新标签
    $('.recommendations').empty().html(JST['template/detail_tags'](item))

    this.currentItemImages = item.images;
    this.currentItemLikeNum = item.likeNum;
    this.likeCurrentItem = item.like == 'true';
    //added by jinjianfeng , for comments
    YA_GLOBAL.itemId = item.itemId;
    YA_GLOBAL.isvCode = item.isvInfo.isvCode;

    Youai.router.navigate('!detail/' + item.itemId + '/' + item.isvInfo.isvCode)
  },

  showComemnts: function() {
    new Youai.commentsView({
        method:"getItemComments"
    });
  },

  showImageSlide: function() {
//      "images":this.get("images"),
//  "likeNum":this.get("likeNum"),
//  "isLiked":this.get("like") === "true"
// Youai.sliderShow.init('slider',data);
    Youai.sliderShow.init('slider', {
      images: this.currentItemImages,
      likeNum: this.currentItemLikeNum,
      isLiked: this.likeCurrentItem
    });
  }

})