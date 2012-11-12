Youai.goodListView = Backbone.View.extend({

    el:"#content",

    tpl:{
        "goodLayout":JST["template/list_good"]
    },

    events:{

    },

    initialize:function (options) {

        this.$el.html(this.tpl["goodLayout"]());

        if (options.goodUrl) {
            this.goodList = new Youai.GoodList();
            this.goodList.url = options.goodUrl;
            this.goodList.fetch();
            this.goodList.on('reset', this.render, this);
        }
        if (options.data) {
            this.goodList = options.data;
            this.render();
        }

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