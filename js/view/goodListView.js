Youai.goodListView = Backbone.View.extend({

    el:"#content",

    templates:{
        "list-goodLayout":JST["template/list_good"],
        "list-bigGoodsSlider":JST["template/list_Slider"]
    },

    events:{

    },

    initialize:function (options) {
        this.goodList = new Youai.GoodList();
        this.goodList.url = options.goodUrl;
        this.goodList.fetch();
        this.goodList.on('reset', this.render, this);
    },

    addItem:function (good) {

        var goodView = new Youai.goodItemView({model:good});
        return goodView.render();
    },


    render:function () {

        var self = this;

        this.$el.html(this.templates["list-goodLayout"]());

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


    }



});