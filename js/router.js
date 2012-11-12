Youai.Router = Backbone.Router.extend({

    routes:{
        '':"index", //首页
        '!home':"index",//首页
        '!list/:listCode/p:page':'list', //商品列表
        '!like/:id': 'like',
        '!detail/:id':'detail', //详情页
        '!tag':'tag',//类目页
        '!search/:keyword/p:page':'search',//搜索页
        '!albums/:type/p:page':'albums', //专辑列表
        '!album/:id/p:page':"albumItems" //专辑中商品列表
    },

    index:function () {
        var indexView = new Youai.indexView();
    },




    list:function (listCode, pageNo) {

        var url = Youai.Util._devParseUrl("getItemsFromList.json", {"listCode":listCode, "pageSize":"10", "pageNo":pageNo});

        new Youai.goodListView({
            "goodUrl":url
        });

    },

    tag:function(){
        var self = this;

        $("#content").html(JST["template/tag_layout"]());
        $("#J-searchBtn").on("click",function(e){
            e.preventDefault();
            var searchTxt = $("#J-searchContent").val();

            Backbone.history.navigate('!search/'+searchTxt+'/p1');

            self.search(searchTxt,1);
        })

    },

    search:function(keyword,pageNo){

        var searchList = new Youai.GoodList();
        searchList.url = Youai.Util._devParseUrl("getItemsFromSearch.json", {"keyword":encodeURI(keyword), "pageSize":"10", "pageNo":pageNo});
        searchList.fetch();

        var searchListView = new Youai.searchListView({
            "collection":searchList
        });

        searchList.on('reset', searchListView.render, searchListView);
    },

    like: function(page) {
      if (!Youai.like) {
        Youai.like = new Youai.LikeView()
        $('.content').html(Youai.like.el)
      }

      Youai.like.getLikeData()
    },

    detail:function (id) {

        if (!Youai.detail) {
            Youai.detail = new Youai.DetailView()
            $('.content').html(Youai.detail.el)
        }


        Youai.detail.displayItem(id)

        new Youai.commentsView({
         commentUrl:Youai.Util._devParseUrl("getItemComments.json", {"itemId":111, "pageSize":"10", "pageNo":"1"})
         });

    },


    albums:function (type, pageNo) {
        new Youai.albumsView({
            albumType:type,
            pageNo:pageNo
        })
    },

    //专辑
    albumItems:function (albumId, pageNo) {

       var albumInfo = JST["template/album_info"]();

        var url = Youai.Util._devParseUrl("getItemsFromAlbum.json", {"albumId":albumId, "pageSize":"10", "pageNo":pageNo});

        var albumGoods = new Youai.GoodList();

        Youai.Util.Ajax(url,function(resp){
            albumGoods.reset(resp.data.result.data);
            new Youai.goodListView({
               data:albumGoods
            });
        });

    }

});



