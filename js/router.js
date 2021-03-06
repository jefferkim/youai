/*
* TODO:后期detail页的代码要统一到模型上，有些逻辑在detail页处理后很难反馈到collection上，
* 导致有部分逻辑和代码会冗余并且操作繁琐
* 后期全局数据放到  Youai.DATA命名空间上
*
*
* */

//create global collection
 Youai.Goods = new Youai.GoodList;


//begin router
 Youai.Router = Backbone.Router.extend({

    routes:{
        '':"index", //首页
        '!home':"index", //首页
        '!list/:listCode/p:page':'list', //商品列表
        '!like/:userId/p:page':'like',
        '!detail/:id/:isvCode/:albumId/:scmParams':'detail', //详情页,scmParams:scm参数，额外的统计
        '!category/:type':'category', //类目页,v=>查看，s=>搜索
        '!association/:itemId':'queryAssociation', //相关推荐
        '!style':'style', //风格
        '!stroll/p:page':'stroll', //逛逛
        '!search/:keyword/p:page':'search', //搜索页
        '!albums/:type/p:page':'albums', //专辑列表
        '!album/:id/p:page':"albumItems" //专辑中商品列表
    },

    initialize:function () {

        var wTitle = function () {
            var h1Map = {
                    '有爱':/#!stroll\/p\d*/,
                    '喜欢':/#!like\/[0-9]*/,
                    '详情页':/#!detail\/[0-9]*/,
                    '推荐':/#!association\/[0-9]*/,
                    '分类':/#!category/,
                    '风格':/#!style/,
                    '搜索':/#!search\/((.|\n)*)\/p[0-9]*/,
                    '热门专辑':/#!albums\/recommend\/p[0-9]*/,
                    '我收集的专辑':/#!albums\/like\/p[0-9]*/
                },
                lc = location.hash;
            for (var key in h1Map) {
                var m = lc.match(h1Map[key]);
                if (m) {
                    var title = m[1]?decodeURI(m[1]):key;

                    $("#J-headerT").text(title);
                    title != "详情页" && (Youai.DATA_HEADTITLE = title);
                    break;
                }
            }
        }
        wTitle();

        // 在相应的页面显示主页或返回按钮
        function displayHomeOrBackButton() {
            var hash = location.hash
            if (hash.search('!home') > -1 || hash == '#' || !hash) {
                $('.home-back .home').show()
                $('.home-back .back').hide()
            } else {
                $('.home-back .home').hide()
                $('.home-back .back').show()
            }
        }

        $(displayHomeOrBackButton)

        window.addEventListener("hashchange", function () {
            //TODO:后期提取个基本的方法
            $("#J-mask").hide();
            $("#J-popWrap").html("");
            $(document.body).removeClass("oh");
            $("#tbh5v0").css({
                height:"100%",
                overflow:"visible"
            });

           if(!location.hash.match(/$(search|list|stroll)/gi)){//详情页ios history.back能返回原先位置就不去处理它
                window.scrollTo(0,0)
           }
            wTitle();
            displayHomeOrBackButton()
        }, false);


    },
    //首页
    index:function () {
        $("#J-headerT").text("有爱");
        var indexView = new Youai.indexView();
    },


    //逛逛
    stroll:function (pageNo) {

        $("#J-strollLayout").length < 1 && $("#content").html(JST["template/stroll_layout"]());

        if(!Youai.Util.listBackFixPosition()) return ;//回到列表位置

        //判断是否是预览状态
        var args = Youai.Util._isPreview();
        var extraParams = args ? {isPreview:args["isPreview"], visitCode:args["visitCode"]} : {};

        var url = {api:"com.taobao.wap.rest2.wo3",data:$.extend({"method":"getItemsFromVisit", "pageSize":"30", "pageNo":pageNo || 1},extraParams)};



        Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function (resp) {

            if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                var result = resp.data.result;
                Youai.Goods.reset(result.data);
                new Youai.goodListView({
                    "data":Youai.Goods
                }).render();
                Youai.Mod.renderPageNav(result.recordTotal);
            }
        });
    },
    //列表页
    list:function (listCode, pageNo) {

        $("#J-list").length < 1 && $("#content").html(JST["template/list_good"]());

        if(!Youai.Util.listBackFixPosition()) return ;//回到列表位置

        var args = Youai.Util._isPreview();
        var extraParams = args ? {isPreview:args["isPreview"]} : {};

        var url = {api:"com.taobao.wap.rest2.wo3", data:$.extend({"method":"getItemsFromList", "listCode":listCode, "pageSize":"30", "pageNo":pageNo || 1},extraParams)};



        Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function (resp) {
            if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                var result = resp.data.result;
                $("#J-headerT").text(result.title); //增加标题
                Youai.DATA_HEADTITLE = result.title;

                Youai.Goods.reset(result.data);
                new Youai.goodListView({
                    "data":Youai.Goods
                }).render();

                Youai.Mod.renderPageNav(result.recordTotal);
            }
        });

    },
    //类目
    category:function (type) {
        var self = this;
        YA_GLOBAL.itemIdForListBack = null;
        $("#J-tagLayout").length < 1 && $("#content").html(JST["template/tag_layout"]());


        Youai.mtopH5.getApi("com.taobao.wap.rest2.wo3", "1.0", {"method":"getCategoryConfig", "type":"1"}, {},
            function (resp) {
                if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                    $("#J-tagPageContent").html(resp.data.result.data);

                } else {
                    notification.flash('接口调用错误，请刷新重试').show();
                }
            }
        );

        var searchInput = $("#J-searchContent");
        if (type == "s") {
                searchInput.focus();
        }
        searchInput.focus(function () {
            $(".no-search-result").hide();
        });

        $("#J-searchBtn").on("click", function (e) {
            e.preventDefault();
            var searchTxt = $.trim(searchInput.val());
            searchTxt = searchTxt.replace(/[~!@#$%^&*.<>]*/g,"");
            if (searchTxt === "") {
                self.navigate('!stroll/p1', {trigger: true});
                return;
            }



            var url = {api:"com.taobao.wap.rest2.wo3", data:{"method":"getItemsFromSearch", "pageSize":"30", "pageNo":"1", "keyword":searchTxt}};

            Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function (resp) {
                if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                    var result = resp.data.result;
                    if (result.recordTotal === "0") {
                        $(".no-search-result").show();
                    } else {
                        $("#content").html(JST["template/list_good"]());

                        Youai.Goods.reset(result.data);

                        new Youai.goodListView({
                            data:Youai.Goods
                        }).render();

                        self.navigate('!search/'+encodeURI(searchTxt)+'/p1');//不encode会出问题

                        Youai.Mod.renderPageNav(result.recordTotal);
                    }
                }
            });

        })

    },
    //风格
    style:function () {

        $("#J-styleLayout").length < 1 && $("#content").html(JST["template/style_layout"]());

        YA_GLOBAL.itemIdForListBack = null;
        Youai.mtopH5.getApi("com.taobao.wap.rest2.wo3", "1.0", {"method":"getCategoryConfig", "type":"2"}, {},
            function (resp) {
                if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                    $("#J-stylePageContent").html(resp.data.result.data);
                } else {
                    notification.flash('接口调用错误，请刷新重试').show();
                }
            }
        );

    },
    //关联推荐
    queryAssociation:function(itemId){
        var url = {api:"com.taobao.wap.rest2.wo3", data:{"method":"getItemsFromAssociation", "pageSize":"10", "pageNo":1, "itemId":itemId}};

        $("#content").html(JST["template/list_good"]());
        Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function (resp) {
            if(resp.ret[0].indexOf("SUCCESS::") != -1){
                YA_GLOBAL.albumId = 0;  //关联推荐默认albumId设置成0

                Youai.Goods.reset(resp.data.result.data);

                new Youai.goodListView({
                    "data":Youai.Goods
                }).render();
            }
        });
    },
    //搜索页
    search:function (keyword, pageNo) {
        var url = {api:"com.taobao.wap.rest2.wo3", data:{"method":"getItemsFromSearch", "pageSize":"30", "pageNo":pageNo || 1, "keyword":decodeURI(keyword)}};

        $("#content").html(JST["template/list_good"]());

        if(!Youai.Util.listBackFixPosition()) return;//回到列表位置
        var searchList = new Youai.GoodList();

        Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function (resp) {
            if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                var result = resp.data.result;
                searchList.reset(result.data);

                new Youai.goodListView({
                    "data":searchList
                }).render();

                Youai.Mod.renderPageNav(result.recordTotal);
            }
        });

    },
    //我的喜欢
    like:function (userId, page) {

        Youai.likeView = new Youai.LikeView({ userId:userId, page:page })
        $('#content').html(Youai.likeView.el)
        Youai.likeView.getLikeData(userId, page)
    },

    //详情页
    detail:function (id, isvCode, albumId , scmParams) {

        Youai.detail = new Youai.DetailView()
        $('#content').html(Youai.detail.el)

        Youai.detail.getItemData(id, isvCode, albumId , scmParams)

    },

    //推荐专辑和我关注的专辑
    albums:function (type, pageNo) {

        $("#content").html(JST["template/album_layout"]({"type":type}));

        var url = {api:"com.taobao.wap.rest2.wo3", data:{"method":(type === "recommend" ? "getRecommendAlbums" : "getLikeAlbums"), "pageSize":"10", "pageNo":pageNo || 1}};
        var albumList = new Youai.albumList();

        Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function (resp) {
            Youai.Util._checkLogin(resp);
            if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                var result = resp.data.result,
                    data = result.data;

                YA_GLOBAL.itemIdForListBack = null;

                //我关注的专辑数据接口是不一样的
                if (resp.data.method === "getLikeAlbums") {
                    if(data.length == 0){
                        $("#J-ablums").html('<div style="margin-top:30px;">您还没有收集任何专辑,先去逛逛吧!</div>');
                        return;
                    }
                    albumList.reset(_.flatten(_.pluck(data, "records"), "albumId"));
                } else {
                    albumList.reset(data);
                }
                new Youai.albumsView({
                    "data":albumList
                }).render();

                Youai.Mod.renderPageNav(result.recordTotal,10);
            } else {
                //notification.flash('接口调用错误，请刷新重试').show();
            }
        });

    },

    //专辑商品列表
    albumItems:function (albumId, pageNo) {

        $("#J-albumItemInfo").length < 1 && $("#content").html(JST["template/album_info_layout"]());

        var url = {api:"com.taobao.wap.rest2.wo3", data:{"method":"getItemsFromAlbum", "albumId":albumId, "pageSize":"30", "pageNo":pageNo}};



        Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function (resp) {
            if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                var result = resp.data.result;
                $("#J-headerT").text(result.title);

                Youai.Goods.reset(result.data);
                Youai.DATA_HEADTITLE = result.title;

                var albumInfo = new Youai.Album();
                albumInfo.set(result);
                var albumInfoView = new Youai.albumInfoView({model:albumInfo});

                $("#J-albumInfoWrap").html(albumInfoView.render().el);
                //good model里面每个接口都不是返回相同的模型，导致需要加入全局，评论中也需要
                YA_GLOBAL.albumId = result.albumId;
                YA_GLOBAL.isvCode = result.isvInfo.isvCode;

                if(!Youai.Util.listBackFixPosition()) return;//回到列表位置

                new Youai.goodListView({
                    data:Youai.Goods
                }).render();



                Youai.Mod.renderPageNav(result.itemTotal);
            } else {
                //notification.flash('接口调用错误，请刷新重试').show();
            }
        });
    }

});



