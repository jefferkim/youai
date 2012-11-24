Youai.Router = Backbone.Router.extend({

    routes:{
        '':"index", //首页
        '!home':"index", //首页
        '!list/:listCode/p:page':'list', //商品列表
        '!like/:id':'like',
        '!detail/:id':'detail', //详情页
        '!category':'category', //类目页
        '!style':'style', //风格
        '!stroll/p:page':'stroll', //逛逛
        '!search/:keyword/p:page':'search', //搜索页
        '!albums/:type/p:page':'albums', //专辑列表
        '!album/:id/p:page':"albumItems" //专辑中商品列表
    },

    initialize:function () {

        var wTitle = function(){
            var h1Map = {
                    '首页'        :/#!home/,
                    '逛逛'        :/#!stroll\/p\d*/,/*
                    '列表'        :/#!list\/[0-9]*\/p[0-9]*//*,*/
                    '喜欢'        :/#!like\/[0-9]*/,
                    '详情页'       :/#!detail\/[0-9]*/,
                    '类目'        :/#!category/,
                    '风格'        :/#!style/,
                    '搜索'        :/#!search\/((.|\n)*)\/p[0-9]*/,
                    '专辑'        :/#!albums\/recommend\/p[0-9]*/,
                    '我关注的专辑'  :/#!albums\/like\/p[0-9]*//*,
                    '专辑列表'      :/#!album\/[0-9]*\/p[0-9]*///头部专辑列表中的文字改掉
                },
                lc = location.hash;
            for (var key in h1Map) {
                var m = lc.match(h1Map[key]);
                if (m) {
                    if(m[1]){
                        $("#J-headerT").text("搜索:"+m[1]);
                    }else{
                        $("#J-headerT").text(key);
                    }
                    break;
                }
            }
        }
        wTitle();

        window.addEventListener("hashchange", function () {
            wTitle();
        }, false);


    },
    //首页
    index:function () {
        var indexView = new Youai.indexView();


        /*var mtoph5 =  mtop_h5();
        var url = {'api':'com.taobao.wap.rest2.wo3', 'data':{"method":"getCategoryConfig", "type":"2"}, 'extParam':{}};
        mtoph5.getApi(url.api, "1.0", url.data, url.extParam,
            function (a) {
                console.log("fffff");
                console.log(a);
                console.log("fffff");
                 mtopAjax({
                 json: a,
                 error: function(a) {


                 },
                 success: function(a) {


                 }
                 })

            },
            function () {


            }
        );*/



    },

    //逛逛
    stroll:function (pageNo) {

        $("#J-strollLayout").length < 1 && $("#content").html(JST["template/stroll_layout"]());

        //var url = Youai.Util._devParseUrl("getItemsFromVisit.json", {"pageSize":"10", "pageNo":pageNo || 1});
        var url = Youai.Util.parseUrl({"method":"getItemsFromVisit","pageSize":"10", "pageNo":pageNo || 1},$("#J_Sid").val());
        new Youai.goodListView({
            "goodUrl":url
        }).render();

    },
    //列表页
    list:function (listCode, pageNo) {

        $("#J-list").length < 1&&$("#content").html(JST["template/list_good"]());

        new Youai.goodListView({
            //"goodUrl":Youai.Util._devParseUrl("getItemsFromList.json", {"listCode":listCode, "pageSize":"10", "pageNo":pageNo})
            "goodUrl":Youai.Util.parseUrl({"method":"getItemsFromList","listCode":listCode,"pageSize":"30","pageNo":pageNo},$("#J-sid").val())
        }).render();

    },
    //类目
    category:function () {
        var self = this,
            U = Youai.Util;

        $("#J-tagLayout").length <1 && $("#content").html(JST["template/tag_layout"]());

        U.Ajax(U.parseUrl({"method":"getCategoryConfig","type":"1"}),function(resp){
            $("#J-tagPageContent").html(resp.data.result.data);
        });


        $("#J-searchBtn").on("click", function (e) {
            e.preventDefault();

            var searchTxt = $.trim($("#J-searchContent").val());
            if (searchTxt === "") {
                self.navigate('!stroll/p1', true);
                return;
            }
            var searchGoodList = new Youai.GoodList();

            //var url = Youai.Util._devParseUrl("getItemsFromSearch.json", {"keyword":encodeURI(searchTxt), "pageSize":"10", "pageNo":1});
            var url = U.parseUrl({"method":"getItemsFromSearch","pageSize":"30","pageNo":"1","keyword":encodeURI(searchTxt)} );

            U.Ajax(url, function (resp) {
                if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                    var result = resp.data.result;
                    if (result.recordTotal === "0") {
                        $(".no-search-result").show();
                    } else {
                        self.navigate('!search/' + searchTxt + '/p1');
                        searchGoodList.reset(result.data);
                        new Youai.searchListView({
                            data:searchGoodList
                        });
                        new PageNav({'id':'#J-pageNav', 'pageCount':Math.ceil(result.recordTotal / 30), 'objId':'p'});
                    }

                }
            });

        })

    },
    //风格
    style:function () {

       $("#J-styleLayout").length <1 && $("#content").html(JST["template/style_layout"]());
        Youai.Util.Ajax(Youai.Util.parseUrl({"method":"getCategoryConfig","type":"2"}),function(resp){
            $("#J-stylePageContent").html(resp.data.result.data);
        });

    },
    //搜索页
    search:function (keyword, pageNo) {

       // var url = Youai.Util._devParseUrl("getItemsFromSearch.json", {"keyword":encodeURI(keyword), "pageSize":"10", "pageNo":pageNo || 1});
        var url  = Youai.Util.parseUrl({"method":"getItemsFromSearch","pageSize":"10","pageNo":pageNo||1,"keyword":encodeURI(keyword)});

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

        $("#J-albumItemInfo").length <1 && $("#content").html(JST["template/album_info_layout"]());

        var self = this,
           // url = Youai.Util._devParseUrl("getItemsFromAlbum.json", {"albumId":albumId, "pageSize":"10", "pageNo":pageNo});
            url = Youai.Util.parseUrl({"method":"getItemsFromAlbum", "albumId":albumId, "pageSize":"10", "pageNo":pageNo},$("#J_Sid").val());

        var albumGoods = new Youai.GoodList();

        Youai.Util.Ajax(url, function (resp) {

            var result = resp.data.result;
            $("#J-headerT").text(result.title);
            albumGoods.reset(result.data);
            var albumInfo = new Youai.albumInfo();
            $("#J-albumInfoWrap").html(albumInfo.render({"albumInfo":result}).el);

            new Youai.goodListView({
                data:albumGoods
            }).render();

            new PageNav({'id':'#J-pageNav', 'pageCount':Math.ceil(result.recordTotal / 30), 'objId':'p'});
        });
    }

});



