Youai.indexView = Backbone.View.extend({

    el:"#content",

    templates:{
        "home-layout":tpl("template/home_layout"),
        "weather":tpl("template/weather"),
        "home-good":tpl("template/home_good"),
        "home-album":tpl("template/home_album"),
        "home-youai":tpl("template/home_youai")
    },


    events:{

    },

    initialize:function () {

        //加载天气数据
        this.loadWeatherData();
        //加载整体框架数据
        this.loadLayout();

    },


    _parseWeather:function (data) {


        var weather = _.template(this.templates["home-good"], {"good_subtitle":data.t1, "good_html":"11111"});

        console.log(weather);

    },

    loadWeatherData:function () {
        var self = this;
        $.ajax({
            url:'http://weather.tao123.com/static/weather/weather_api.php?action=?',
            success:function (data) {
                // self._parseWeather(data);
            },
            error:function (xhr, type) {
                alert('获取天气信息错误!')
            }
        });

    },


    _addModGood:function (result) {
        var goodTpl = _.template(this.templates["home-good"], {
            "home_goodTitle":result.copywriters[0].content,
            "home_goodInfo":result.homeOperators
        });
        $("#J-modGood", this.el).html(goodTpl);
    },

    _addModAlbum:function (result) {
        var albumTpl = _.template(this.templates["home-album"], {
            "home_albumTitle":result.copywriters[1].content,
            "firstAlbumOperators":result.firstAlbumOperators,
            "albums":result.albums
        });
        $("#J-modAlbum", this.el).html(albumTpl);
    },

    _addModYouai:function (result) {
        var youaiTpl = _.template(this.templates["home-youai"], {
            "home_youaiTitle":result.copywriters[1].content,
            "content":result.itemArea
        });
        $("#J-modYouai", this.el).html(youaiTpl);
    },

    loadLayout:function () {
        var self = this;
        $(this.el).html(this.templates["home-layout"]);

        $.ajax({
            url:Youai.Util.parseUrl("getHomeInfo", "83fb97e85b9c12374f8b8426e5d564d8"),
            success:function (resp) {
                var data = resp.data.result;
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