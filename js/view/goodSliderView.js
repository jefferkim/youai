/*
 * 宝贝滑动组件
 * 传入model
 *
 * */

Youai.goodSliderView = Backbone.View.extend({

    el:"#content",

    templates:{
        "list-slider":JST["template/list_slider"]
    },

    events:{
        "click .J-like":"toggleLike",
        "click #J-prev":"_prev",
        "click #J-next":"_next"

    },

    initialize:function () {
        this.slider = null;
        this.model.on("change", this.render, this);



    },

    //取消加关注
    toggleLike:function (e) {
        e.preventDefault();
        var goodItem = this.model.toJSON();

        Youai.Mod.toggleLike({
            eventTarget:t,
            itemId:goodItem.itemId,
            isvCode:goodItem.isvInfo["isvCode"]
        });





    },

    _prev:function (e) {
        e.preventDefault();
        this.slider.prev();
        $(".good-operater").animate({
            height:40,
            opacity:1
        }, 500, 'ease')
    },

    _next:function (e) {
        e.preventDefault();
        this.slider.next();
        $(".good-operater").animate({
            height:0,
            opacity:0.2
        }, 500, 'ease')
    },

    destroy:function(){


    },

    render:function () {

        this.$el.append(this.templates["list-slider"](this.model.getItemList()));

        $("#J-mask").show();

        this.slider = new Swipe(document.getElementById('slider'), {
            callback:function (event, index, elem) {

            }
        });


    }
});