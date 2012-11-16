Youai.goodListView = Backbone.View.extend({

    el:"#content",

    tpl:{
        "goodLayout":JST["template/list_good"]
    },

    events:{

    },

    initialize:function (options) {

        if (options.goodUrl) {
            this.goodList = new Youai.GoodList();
            this.goodList.url = options.goodUrl;
            this.goodList.fetch();
            this.goodList.on('reset', this.render, this);
        }
        if (options.data) {
            this.goodList = options.data;
        }
        //弹出气泡提示
        $(document.body).on("list:popcomment",function(e,_self){
            var comment = _self.parents("li").find(".pop-comment");
            _self.removeClass("hascomment");
            comment.show().animate({
                opacity:1
            }, 1000, 'ease', function () {
                var that = this;
                setTimeout(function () {
                    $(that).animate({
                        opacity:0
                    }, 500, 'ease', function () {
                        $(that).hide();

                    })
                }, 2000);
            })
        });

    },

    addItem:function (good) {

        var goodView = new Youai.goodItemView({model:good});
        return goodView.render();

    },


    render:function () {

        var self = this;
        $("#J-waterfall").html("");
        new Youai.Waterfall("#J-waterfall", {
            colWidth:152,
            load:function (success) {
                var items = [],
                    heights = [];

                self.goodList.each(function (good) {
                    items.push(self.addItem(good))
                    heights.push(parseInt(good.height()) + 34);
                });

                success(items, heights);
            }
        });

        lazyload.init();

    }

});