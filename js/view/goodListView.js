Youai.goodListView = Backbone.View.extend({

    el:"#J-webapp",

    tpl:{
        "goodLayout":JST["template/list_good"]
    },

    events:{
        
    },

    initialize:function (options) {

        this.goodList = options.data;
        //弹出气泡提示
        Youai.Mod.popComment();

    },

    addItem:function (good) {
        var goodView = new Youai.goodItemView({model:good});
        return goodView.render();

    },

    render:function () {

        var self = this;
        $("#J-waterfall").html("");
        Youai.DATA_ITEMID_INDEX = [];
        Youai.DATA_ITEMID_H = [];
        Youai.DATA_CURRENTHASH = location.hash;
        new Youai.Waterfall("#J-waterfall", {
            colWidth:152,
            load:function (success) {
                var items = [],
                    heights = [];

                self.goodList.each(function (good) {
                    items.push(self.addItem(good));
                    heights.push(parseInt(good.height()) + 34);
                });
                success(items, heights);
            }
        });

        lazyload.init();

        Youai.DATA_LISTHTML = $("#J-waterfall");

        YA_GLOBAL.itemIdForListBack = null;
    }

});