Youai.Router = Backbone.Router.extend({

    routes:{
        '':"index",//首页
        '!list/:listCode/p:page':'list',//分页查找列表下的商品列表,接口对应getItemsFromList
        '!detail/:id':'detail', //详情页
        '!albums/:page':"albums",//专辑
        '!album/:id/:page':"getItemsFromAlbum"
    },

    index:function(){
        var indexView = new Youai.indexView();
    },

    /*列表页*/
    list:function (listCode,pageNo) {

        var url = Youai.Util._devParseUrl("getItemsFromList.json", {"listCode":listCode, "pageSize":"10", "pageNo":pageNo});

        new Youai.goodListView({
            "goodUrl":url
        })

    },

    detail:function (id) {

        if (!Youai.detail) {
          Youai.detail = new Youai.DetailView()
          $('.content').html(Youai.detail.el)
        }

        Youai.detail.displayItem(id);

        new Youai.commentsView({
            commentUrl:Youai.Util._devParseUrl("getItemComments.json", {"itemId":111, "pageSize":"10", "pageNo":"1"})
        });

    },


    albums:function(pageNo){
        var albumList = new Youai.albumList();
        albumList.url =  Youai.Util._devParseUrl("getRecommendAlbums.json", {"pageSize":"10", "pageNo":pageNo});
        var albumview = new Youai.albumsView({
            collection:albumList
        });
        albumList.fetch();
        albumList.on('reset', albumview.render, albumview);
    },

    getItemsFromAlbum:function(id,pageNo){
        var url =  Youai.Util._devParseUrl("getItemsFromAlbum.json", {"albumId":id,"pageSize":"10", "pageNo":pageNo});
        new Youai.goodListView({
            goodUrl:url
        });
    }


});



