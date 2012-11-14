Youai.Router = Backbone.Router.extend({

    routes:{
        '':"index", //首页
        '!home':"index", //首页
        '!list/:listCode/p:page':'list', //商品列表
        '!like/:id':'like',
        '!detail/:id':'detail', //详情页
        '!tag':'tag', //类目页
        '!style':'style', //风格
        '!search/:keyword/p:page':'search', //搜索页
        '!albums/:type/p:page':'albums', //专辑列表
        '!album/:id/p:page':"albumItems" //专辑中商品列表
    },
    //首页
    index:function () {
        var indexView = new Youai.indexView();
    },

    //列表页
    list:function (listCode, pageNo) {
        var url = Youai.Util._devParseUrl("getItemsFromList.json", {"listCode":listCode, "pageSize":"10", "pageNo":pageNo});

        new Youai.goodListView({
            "goodUrl":url
        });
    },
    //类目
    tag:function () {
        var self = this;

        $("#content").html(JST["template/tag_layout"]());

        $("#J-searchBtn").on("click", function (e) {
            e.preventDefault();
            var searchTxt = $("#J-searchContent").val(),
                searchGoodList = new Youai.GoodList();

            var url = Youai.Util._devParseUrl("getItemsFromSearch.json", {"keyword":encodeURI(searchTxt), "pageSize":"10", "pageNo":1});

            Youai.Util.Ajax(url, function (resp) {
                if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                    var result = resp.data.result;
                    if (result.recordTotal === "0") {
                        $(".no-search-result").show();

                    } else {
                        Backbone.history.navigate('!search/' + searchTxt + '/p1');
                        searchGoodList.reset(result.data);
                        new Youai.searchListView({
                            data:searchGoodList
                        });
                    }

                }
            });

        })

    },
     //风格
    style:function () {

        $("#content").html(JST["template/style_layout"]());

    },
    //搜索页
    search:function (keyword, pageNo) {

        var url = Youai.Util._devParseUrl("getItemsFromSearch.json", {"keyword":encodeURI(keyword), "pageSize":"10", "pageNo":pageNo || 1});
        //searchList.url = Youai.Util.parseUrl({"method":"getItemsFromSearch","pageSize":"10","pageNo":pageNo||1,"keyword":encodeURI(keyword)});

        new Youai.searchListView({
            "searchUrl":url
        });


    },
    //我的喜欢
    like:function (page) {
        if (!Youai.like) {
            Youai.like = new Youai.LikeView()
            $('.content').html(Youai.like.el)
        }

        Youai.like.getLikeData()
    },

    //详情页
    detail:function (id) {

        Youai.detail = new Youai.DetailView()
        $('.content').html(Youai.detail.el)

        Youai.detail.displayItem(id)

        /*new Youai.commentsView({
         commentUrl:Youai.Util._devParseUrl("getItemComments.json", {"itemId":111, "pageSize":"10", "pageNo":"1"})
         });*/

    },

    //推荐专辑和我关注的专辑
    albums:function (type, pageNo) {
        new Youai.albumsView({
            albumType:type,
            pageNo:pageNo
        })
    },

    //专辑商品列表
    albumItems:function (albumId, pageNo) {

        var url = Youai.Util._devParseUrl("getItemsFromAlbum.json", {"albumId":albumId, "pageSize":"10", "pageNo":pageNo});

        var albumGoods = new Youai.GoodList();

        Youai.Util.Ajax(url, function (resp) {
            var result = resp.data.result,
                likeNum = parseInt(result.likeNum);

            albumGoods.reset(result.data);
            new Youai.goodListView({
                data:albumGoods
            });

            $("#content").prepend(JST["template/album_info"]({"albumInfo":result}));

            $("#content").delegate(".J-fav", "click", function (e) {
                e.preventDefault();
                var target = e.currentTarget;

                Youai.Mod.toggleAlbumLike({
                    eventTarget:target,
                    itemId:result.albumId,
                    isvCode:result.isvInfo.isvCode,
                    success:function (response) {
                        if (response.ret[0].indexOf("SUCCESS::") != -1) {
                            $(target).toggleClass("added");
                            likeNum = likeNum + ($(target).hasClass("added") ? 1 : -1);
                            if (response.data.method === "likeAlbum") {
                                $(target).html("取消收集");
                            } else {
                                $(target).html("<em>收集</em><b>" + likeNum + "</b>");
                            }
                        }
                    }
                });
            });

        });

    }

});



