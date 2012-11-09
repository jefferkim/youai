/*
 * Mod方法
 * 暂时加入
 *
 * */


Youai.Mod = {
    //增加喜欢和取消喜欢
    toggleLike:function (cfg) {

        var U = Youai.Util,
            t = cfg.eventTarget,
            method = $(t).hasClass("on") ? "dumpAlbum" : "likeItem";

        var url = U.parseUrl({"method":method, "itemId":cfg.itemId, "isvCode":cfg.isvCode}, $("#J_Sid").val());

        var success = function (response) {
            if(response.ret[0].indexOf("SUCCESS::") != -1){
                $(t).trigger("changeUI");
            }
        };

        U.Ajax(url, success);
    },

    //显示slider
    showSlider:function(id,data){

        $("#content").append(JST["template/list_slider"](data));

        var docEl = document.documentElement,
            sliderEl = $(".slider-holder"),
            top = document.body.scrollTop;

       sliderEl.css({"top":top + 100});


        $("#J-mask").css({
            "top":top
        })
        $("#J-mask").show();

        var slider = new Swipe($(id)[0], {
            preload:2,
            lazyloadClass:"lazy-img",
            lazyloadDataAttr:"data-img",
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

        slider.load();
        sliderEl.show();
        sliderEl.addClass("bounceIn");


        $('body > div').click(function(ev){
            var target=ev.target || ev.srcElement;
            if(target.nodeName.toUpperCase()==='DIV'){
                if($(target).attr('id') == 'J-mask'){
                     slider.destroy();
                     sliderEl.removeClass("bounceIn").addClass("bounceOut");
                     $("#J-mask").hide();
                }
            }
        });


    }


}