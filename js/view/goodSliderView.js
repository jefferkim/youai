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
        "click .J-like":"addLike",
        "click #J-prev":"_prev",
        "click #J-next":"_next"

    },

    initialize:function () {
        this.slider = null;
        this.model.on("change", this.render, this);



    },

    addLike:function (e) {
        e.preventDefault();
        alert(":Fffff");

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