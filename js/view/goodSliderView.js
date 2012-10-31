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
        "changeUI .J-like":"changeUI",
        "click #J-prev":"_prev",
        "click #J-next":"_next"
    },

    initialize:function () {
        this.slider = null;
        //this.model.on("change", this.t, this);
    },

    /*TODO::this.model.save*/
    changeUI:function (e) {
        var target = e.currentTarget,
            operater = $(target).parents(".good-operater"),
            likebox = operater.find(".like-num"),
            likeNum = operater.find(".J-likeNum");

        $(target).toggleClass("on");
        var dest = $(target).hasClass("on") ? 1 : -1;

        this.model.set({
            "like":$(target).hasClass("on")? "true":"false",
            "likeNum":parseInt(likeNum.text()) + dest
        });


        likeNum.text(parseInt(likeNum.text()) + dest);


        likebox.animate({
            "opacity":1,
            "right":40
        }, 200, 'ease-in', function () {
            var othis = $(this);
            setTimeout(function () {
                othis.animate({
                    "opacity":0,
                    "right":0
                });
            }, 2000);
        });

    },
    //取消加关注
    toggleLike:function (e) {
        e.preventDefault();
        var goodItem = this.model.toJSON();

        Youai.Mod.toggleLike({
            eventTarget:e.currentTarget,
            itemId:goodItem.itemId,
            isvCode:goodItem.isvInfo["isvCode"]
        });

    },

    _prev:function (e) {
        e.preventDefault();
        this.slider.prev();

    },

    _next:function (e) {
        e.preventDefault();
        this.slider.next();

    },

    destroy:function(){


    },

    render:function () {
        var self = this;

        this.$el.append(this.templates["list-slider"](this.model.getItemList()));

        $("#J-mask").show();

        this.slider = new Swipe(document.getElementById('slider'), {
            callback:function (event, index, elem) {
                var operater = $(".good-operater");
                if(index == 0){
                    operater.animate({
                        opacity:1
                    }, 500, 'ease');
                }else{
                    operater.css({opacity:0});
                }
            }
        });

        $('body > div').click(function(ev){
            var target=ev.target || ev.srcElement;
            if(target.nodeName.toUpperCase()==='DIV'){
                if($(target).attr('id') == 'J-mask'){
                    self.slider.destroy();
                    $(".slider-holder").remove();
                    $("#J-mask").hide();
                }
            }
        });


    }
});