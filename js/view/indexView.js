Youai.indexView = Backbone.View.extend({

    el:"#J-List",

    templates:{
        "weather": "template/weather"
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


        var t = _.template(tpl(this.templates["weather"]), {"t1":data.t1});

        console.log(t);


    },

    loadWeatherData:function () {
        var self = this;
        $.ajax({
            url:'http://weather.tao123.com/static/weather/weather_api.php?action=?',
            success:function (data) {
                self._parseWeather(data);
            },
            error:function (xhr, type) {
                alert('Ajax error!')
            }
        });

    },

    loadLayout:function () {

    },

    _render:function () {

        var tpl = this.template;
        var collections = this.options.Collection.toJSON();

        new Youai.Waterfall("#J-List", {
            load:function (success) {
                var items = [],
                    heights = [];
                $.each(collections, function (index, item) {
                    items.push(Mustache.to_html(tpl, {"lists":item}));
                    heights.push(item.height);
                });

                success(items, heights);
            }
        });

    }


});