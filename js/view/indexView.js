Youai.indexView = Backbone.View.extend({

    el:"#content",

    templates:{
        "home-layout":JST["template/home_layout"],
        "home-user":JST["template/home_user"],
        "home-good":JST["template/home_good"],
        "home-album":JST["template/home_album"],
        "home-youai":JST["template/home_youai"]
    },


    events:{

    },

    initialize:function () {
        //加载整体框架数据
        this.loadLayout();
    },

    //将天气参数map到不同的天气情况
    _parseWeather:function (index) {
        var map = {
            'heavyrain':[10, 11, 12, 24, 25], //大雨
            'cloudy':[2, 20, 29, 30], //多云
            'clear':[0, 18], //晴
            'spit':[3, 7, 21, 22], //小雨
            'snow':[14, 15, 16, 17, 26, 27, 28], //雪
            'overcast':[1, 13, 31], //阴
            'moderaterain':[4, 5, 6, 8, 9, 19, 23]//中雨
        }
        for (var key in map) {
            if ($.inArray(parseInt(index), map[key]) != -1) {
                return key;
            }
        }
    },

    _addModUser:function (result) {
        var self = this;
        $.ajax({
            url:'http://weather.tao123.com/static/weather/weather_api.php?action=?',
            success:function (data) {

                var weatherIcon = self._parseWeather(data.img1);

                var userTpl = self.templates["home-user"]({
                    "isLogined":result.user ? true : false,
                    "userFace":result.user ? "http://wwc.taobaocdn.com/avatar/getAvatar.do?userId=" + result.user.userId + "&width=40&height=40&type=sns" : "",
                    "userNick":result.user ? result.user.userNick : "",
                    "loginInfo":result.msg ? result.msg.msg : result.copywriters[0].content,
                    "weatherIcon":weatherIcon,
                    "temperature":data.t1
                });

                $("#J-modUser", self.el).html(userTpl);

            },
            error:function (xhr, type) {
                alert('获取天气信息错误!')
            }
        });

    },

    _addModGood:function (result) {
        var goodTpl = this.templates["home-good"]({
            "home_goodTitle":result.copywriters[1].content,
            "home_goodInfo":result.homeOperators
        });
        $("#J-modGood", this.el).html(goodTpl);
    },

    _addModAlbum:function (result) {
        var albumTpl = this.templates["home-album"]({
            "home_albumTitle":result.copywriters[1].content,
            "firstAlbumOperators":result.firstAlbumOperators,
            "albums":result.albums
        });
        $("#J-modAlbum", this.el).html(albumTpl);
    },

    _addModYouai:function (result) {
        var youaiTpl = this.templates["home-youai"]({
            "home_youaiTitle":result.copywriters[1].content,
            "content":result.itemArea
        });
        $("#J-modYouai", this.el).html(youaiTpl);
    },

    loadLayout:function () {
        var self = this,
            U = Youai.Util;

        $(this.el).html(this.templates["home-layout"]());

        var woMsgId = U.getCookie("WO_MSG");

        $.ajax({

            url:Youai.Util.parseUrl({"method":"getHomeInfo","msgval":woMsgId||""}),
            success:function (resp) {
                var data = resp.data.result;
                if(data.msg){
                    var msgIds = woMsgId ? woMsgId+","+data.msg.id : data.msg.id;
                    U.setCookie("WO_MSG",msgIds,location.hostname.match(/$|(?:m|waptest|wapa)\.taobao\.com/gi)[0]);
                }
                self._addModUser(data);
                self._addModGood(data);
                self._addModAlbum(data);
                self._addModYouai(data);

            },
            error:function (xhr, type) {
                alert('获取首页信息错误')
            }
        });
    }

});