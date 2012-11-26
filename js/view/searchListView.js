Youai.searchListView = Backbone.View.extend({

    el:"#content",

    tpl:{
        "goodLayout":JST["template/list_good"]
    },

    events:{

    },

    initialize:function (options) {

        this.$el.html(this.tpl["goodLayout"]());

        this.searchGoodList = options.data;

        //弹出气泡提示
        Youai.Mod.popComment();

    },

    addItem:function (good) {

        var goodView = new Youai.goodItemView({model:good});
        return goodView.render();
    },


    render:function () {

        var self = this;

        new Youai.Waterfall("#J-waterfall", {
            colWidth:152,
            load:function (success) {
                var items = [],
                    heights = [];

                self.searchGoodList.each(function (good) {
                    items.push(self.addItem(good))
                    heights.push(parseInt(good.height()) + 34);
                });

                success(items, heights);
            }
        });

        lazyload.init();


    }



});