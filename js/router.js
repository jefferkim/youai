Youai.Router = Backbone.Router.extend({

    routes:{
        '':"index", //首页
        '!list/:listCode/p:page':'list', //商品列表
        '!detail/:id':'detail', //详情页
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

    detail:function (id) {

        if (!Youai.detail) {
            Youai.detail = new Youai.DetailView()
            $('.content').html(Youai.detail.el)
        }


        Youai.detail.displayItem(id)

        /*new Youai.commentsView({
         commentUrl:Youai.Util._devParseUrl("getItemComments.json", {"itemId":111, "pageSize":"10", "pageNo":"1"})
         });*/

    },


    albums:function (type, pageNo) {
        new Youai.albumsView({
            albumType:type,
            pageNo:pageNo
        })
    },


    albumItems:function (albumId, pageNo) {
        var url = Youai.Util._devParseUrl("getItemsFromAlbum.json", {"albumId":albumId, "pageSize":"10", "pageNo":pageNo});
        new Youai.goodListView({
            goodUrl:url
        });
    }

});



