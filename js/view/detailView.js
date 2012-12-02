Youai.DetailView = Backbone.View.extend({

  className: 'detail',

  events: {
    'click .comment-count': 'showComemnts',
    'click .vslide li': 'displayAnotherItem',
    'click .big-pic': 'showImageSlide',
    'click .like-count span': 'toggleLike'
  },

  initialize: function() {
    $('h1.title').text('详情页')
    this.$el.html('<div class="loading"><span></span></div>')
  },

  addAssociationTagToItem: function(item) {
    if (item.tags) {
      item.tags.splice(0, 0, { name: '推荐' })
    } else {
      item.tags = [ {name: '推荐'} ];
    }
  },

  getValidImage: function(images) {
    return _.filter(images, function(img) { return img.type ==  '0' })[0]
  },

  render: function(template) {

    var content = template( $.extend(this.data, { img: this.getValidImage(this.data.images), tags: this.data.tags }) )
    this.$el.html(content)
  },

  itemUrl: function(id,isvCode,albumId) {
    //return 'http://api.waptest.taobao.com/rest/api2.do?api=com.taobao.wap.rest2.wo3&type=jsonp&callback=jsonp1&v=*&source=wo&sid=83fb97e85b9c12374f8b8426e5d564d8&data={"method":"getItemDetail","srcType":"10","srcCode":"1","isvCode":"12","itemId":"12121"}'

    return {
      api:"com.taobao.wap.rest2.wo3",
      data:{"method":"getItemDetail","itemId":id,"isvCode":isvCode, "albumId": albumId }
    }
  },

  getItemData: function(id,isvCode, albumId) {
      var self = this;
      var url = this.itemUrl(id,isvCode, albumId);

      Youai.mtopH5.getApi(url.api, "1.0", url.data, {},function (json) {

        if (json.ret[0].search('SUCCESS') > -1) {
            self.data = json.data.result
            self.addAssociationTagToItem(self.data)
            self.currentItemImages = self.data.images;
            self.currentItemLikeNum = self.data.likeNum;
            self.likeCurrentItem    = self.data.like == 'true';
            self.displayItem(id, isvCode, albumId)
          } else {
            console.log('mtop error')
            notification.flash('加载失败，请刷新页面重试。').show()
          }
      });

  },

  displayItem: function(id,isvCode, albumId) {

    //added by jinjianfeng, for comments
    YA_GLOBAL.itemId = this.data.itemId;
    YA_GLOBAL.isvCode = this.data.isvInfo.isvCode;
    YA_GLOBAL.albumId = albumId

    if (this.data.album && this.data.album.data) {  //有专辑
      this.render(JST['template/detail_collection'])

      if (this.data.album.data.length > 3) {
        this.slide = new Swipe($('.vslide')[0], { vertical: true, preload: 4 })
        this.slide.load()
      }

      this.currentItem = _.find(this.data.album.data, function(item) { return item.itemId == YA_GLOBAL.itemId })
      this.currentItemForSlider = this.currentItem
    } else {  // 无专辑
      this.isSingleItem = true
      this.render(JST['template/detail_single'])
      this.currentItemForSlider = this.data
    }

  },

  displayAnotherItem: function(e) {
    $('.vslide li').removeClass('selected')
    $(e.currentTarget).addClass('selected')

    var index = parseInt($(e.currentTarget).attr('data-index'))
    var item  = this.data.album.data[index]
    this.addAssociationTagToItem(item)

    this.currentItem = item
    this.currentItemForSlider = item

    // 更新大图
    $('.big-pic img').attr('src', this.getValidImage(item.images).url + Youai.imageFormat)

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
    $('.recommendations').empty()
    if (item.tags && item.tags.length) {
      $('.recommendations').html( JST['template/detail_tags'](item) )
    }

    this.currentItemImages = item.images;
    this.currentItemLikeNum = item.likeNum;
    this.likeCurrentItem = item.like == 'true';
    //added by jinjianfeng , for comments
    YA_GLOBAL.itemId = item.itemId;
    YA_GLOBAL.isvCode = item.isvInfo.isvCode;

    Youai.router.navigate('!detail/' + item.itemId + '/' + item.isvInfo.isvCode + '/' + YA_GLOBAL.albumId, { replace: true })
  },

  showComemnts: function() {
    new Youai.commentsView({
        method:"getItemComments"
    });
  },

  toggleLike: function(e) {
    if ( !$(e.target).hasClass('liked') ) this.doLikeItem()
    else this.notLikeItem()
  },

  doLikeItem: function() {
    var self = this
    var url = { api:"com.taobao.wap.rest2.wo3",data:{"method":"likeItem","itemId":YA_GLOBAL.itemId, "albumId": this.data.album.albumId, "isvCode":YA_GLOBAL.isvCode}}
    Youai.mtopH5.getApi(url.api, "1.0", url.data, {},function (json) {

      if (!Youai.Util._checkLogin(json)) return

      if (json.ret[0].search('SUCCESS') > -1) {
        if (json.data.result == "true") {
          $('.like-count span').addClass('liked')
          if (self.isSingleItem) { // 单个商品
            self.data.like = "true"
            self.data.likeNum = parseInt(self.data.likeNum) + 1
            $('.like-count strong').text(self.data.likeNum)
          } else {  // 专辑商品
            self.currentItem.like = "true"
            self.currentItem.likeNum = parseInt(self.currentItem.likeNum) + 1
            $('.like-count strong').text(self.currentItem.likeNum)
              console.log("---");
              console.log(self.data);
              console.log(self.currentItem);
              console.log(self.currentItemForSlider);
              console.log("---");

          }
          $(document.body).trigger("likeAction:like");
        }
      } else {
        console.log('mtop error')
        notification.flash('加载失败，请刷新页面重试').show()
      }
    })
  },

  notLikeItem: function() {
    var self = this;
    var url = { api:"com.taobao.wap.rest2.wo3",data:{"method":"dumpItem","itemId":YA_GLOBAL.itemId, "albumId": this.data.album.albumId, "isvCode":YA_GLOBAL.isvCode}}
    Youai.mtopH5.getApi(url.api, "1.0", url.data, {},function (json) {

      if (!Youai.Util._checkLogin(json)) return

      if (json.ret[0].search('SUCCESS') > -1) {
        if (json.data.result == "true") {
          $('.like-count span').removeClass('liked')
          if (self.isSingleItem) {
            self.data.like = "false";
            var likeNum = parseInt(self.data.likeNum);
            if (likeNum) self.data.likeNum = likeNum - 1
            $('.like-count strong').text(self.data.likeNum)

          } else {
            self.currentItem.like = "false"
            var likeNum = parseInt(self.currentItem.likeNum)
            if (likeNum) self.currentItem.likeNum = likeNum - 1
            $('.like-count strong').text(self.currentItem.likeNum)
          }
          $(document.body).trigger("likeAction:dump");
        }
      } else {
        console.log('mtop error')
        notification.flash('加载失败，请刷新页面重试').show()
      }
    })
  },

  showImageSlide:function () {
        var self = this,
            model = new Youai.Good();
        //TODO:后期优化
        model.set(this.currentItemForSlider);
        Youai.sliderShow.init('slider', model, function () {
            $("#J-webapp").undelegate(".J-like","click");
            $("#J-webapp").delegate(".J-like", "click", function (e) {
                e.preventDefault();
                if (!$(e.target).hasClass('on')) self.doLikeItem()
                else self.notLikeItem()
            });
            $(document.body).off("likeAction:like");
            $(document.body).off("likeAction:dump");
            var likeAnim = function(){
                $(".like-num").animate({ "opacity":1,"right":40}, 200, (.47,.2,0,.92), function () {
                    var othis = $(this);
                    setTimeout(function () {
                        othis.animate({"opacity":0,"right":60},200,(.47,.2,0,.92),function(){
                            othis.css({
                                right:0
                            });
                        });
                    }, 2000);
                });
            }
            $(document.body).on("likeAction:like", function () {
                $(".J-like").addClass("on");
                $(".like-num").text("成功收藏");
                likeAnim();
            });
            $(document.body).on("likeAction:dump",function(){
                $(".J-like").removeClass("on");
                $(".like-num").text("成功取消");
                likeAnim();
            });
        });
  }

})