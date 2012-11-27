Youai.goodListView = Backbone.View.extend({

    el:"#J-webapp",

    tpl:{
        "goodLayout":JST["template/list_good"]
    },

    events:{
        "click .J-like":"toggleLike"
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

    changeUI:function (target,goodItem) {
        var operater = $(target).parents(".good-operater"),
            likebox = operater.find(".like-num"),
            likeNum = operater.find(".J-likeNum");

        $(target).toggleClass("on");
        var dest = $(target).hasClass("on") ? 1 : -1;

        likeNum.text(parseInt(goodItem.get("likeNum")) + dest);

        goodItem.set({
          "like":$(target).hasClass("on"),
          "likeNum":parseInt(goodItem.get("likeNum")) + dest
        });

        likebox.animate({
            "opacity":1,
            "right":40
        }, 200, (.47,.2,0,.92), function () {
            var othis = $(this);
            setTimeout(function () {
                othis.animate({
                    "opacity":0,
                    "right":0
                },200,(.47,.2,0,.92));
            }, 2000);
        });
    },

    //取消加关注
    toggleLike:function (e) {
        e.preventDefault();

        var self = this,
            target = e.currentTarget;

        var currentGood = this.goodList.where({"itemId":$(target).attr("data-itemId")}),
            currentGoodInfo = currentGood[0].getItemList();
        console.log("====click on like");
        Youai.Mod.toggleLike({
            eventTarget:target,
            itemId:currentGoodInfo.itemId,
            isvCode:currentGoodInfo.isvCode,
            success:function(response){
                if(response.ret[0].indexOf("SUCCESS::") != -1){
                    self.changeUI(target,currentGood[0]);
                }
            }
        });

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