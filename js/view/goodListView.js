Youai.goodListView = Backbone.View.extend({

    el:"#content",

    templates:{
        "list-goodLayout":JST["template/list_good"],
        "list-bigGoodsSlider":JST["template/list_Slider"]
    },

    events:{

    },

    initialize:function () {


    },

    addItem:function (good) {

        var goodView = new Youai.goodItemView({model:good});
        return goodView.render();
    },


    render:function () {

        var self = this;

        this.$el.html(this.templates["list-goodLayout"]());

        var goodLists = this.collection;

        new Youai.Waterfall("#J-waterfall", {
            colWidth:150,
            load:function (success) {
                var items = [],
                    heights = [];

                goodLists.each(function (good) {
                    items.push(self.addItem(good))
                    heights.push(parseInt(good.height()) + 34);
                });

                success(items, heights);
            }
        });


    }



});