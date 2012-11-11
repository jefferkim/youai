Youai.searchListView = Backbone.View.extend({

    el:"#content",

    tpl:{
        "goodLayout":JST["template/list_good"]
    },

    events:{

    },

    initialize:function (options) {

        this.$el.html(this.tpl["goodLayout"]());

    },

    addItem:function (good) {

        var goodView = new Youai.goodItemView({model:good});
        return goodView.render();
    },


    render:function () {

        var self = this;
        var collection = self.options.collection;

        new Youai.Waterfall("#J-waterfall", {
            colWidth:152,
            load:function (success) {
                var items = [],
                    heights = [];

                collection.each(function (good) {
                    items.push(self.addItem(good))
                    heights.push(parseInt(good.height()) + 34);
                });

                success(items, heights);
            }
        });

        lazyload.init();


    }



});