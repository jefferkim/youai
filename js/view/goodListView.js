Youai.goodListView = Backbone.View.extend({

    el:"#J-webapp",

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
        $("#J-list").html("");
        //TODO:后期将data统一加到Youai.DATA命名空间上
        Youai.DATA_ITEMCOLLECTION = self.goodList;
        Youai.DATA_ITEMID_INDEX = [];
        Youai.DATA_ITEMID_H = [];
        Youai.DATA_CURRENTHASH = location.hash;
        //TODO:后期waterfall的渲染create一个dom先在内存中渲染后一次性添加到页面中
       var t = new Youai.Waterfall("#J-waterfall", {
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

       var h = t.container;
       $("#J-list").html(h);
        lazyload.init();

        Youai.DATA_LISTHTML = h;

        YA_GLOBAL.itemIdForListBack = null;
    }

});