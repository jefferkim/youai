Youai.sliderShow = {

    init:function (id, data) {
        var self = this;
        this.maskEl = $("#J-mask"),
        this.goodSlider = null;

        this.renderUI(id, data);
        this.destroyUI();
    },

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
        var goodItem = this.model.toJSON();

        Youai.Mod.toggleLike({
            eventTarget:e.currentTarget,
            itemId:goodItem.itemId,
            isvCode:goodItem.isvInfo["isvCode"]
        });

    },

    _showMask:function () {
        this.maskEl.show().animate({
            opacity:0.8
        }, 1000, 'ease');

    },

    _hideMask:function () {
        this.maskEl.animate({
            opacity:0
        }, 1000, 'ease', function () {
            $(this).hide();
        });
    },

    _bounceSlider:function () {
        var sliderEL = $("#J-sliderHolder");
        sliderEL.css({"top":document.body.scrollTop + 100});
        sliderEL.show();
        sliderEL.removeClass("bounceOut").addClass("bounceIn");
    },

    renderUI:function (sliderID, data) {
        var self = this;
        for (var i = 0, LIS = "", imgs = data.images; i < imgs.length; i++) {

            LIS += '<li><img class="lazy" data-src="' + imgs[i].url + '_570x570.jpg" src="http://img01.taobaocdn.com/tps/i1/T1_uZXXj0cXXbQbJvh-50-52.png" width="284"/>'
                + (i == 0 ? '<span class="good-operater"><a href="#" class="J-like ' + data.isLiked + '"></a><span class="like-num"><em class="J-likeNum">' + data.likeNum + '</em>人已喜欢</span></span>' : "")
                + '</li>';

        }

        if ($("#" + sliderID).length < 1) {
            var sliderDOM = [],
                nav_holder = '<div class="nav-holder"><a href="#" class="prev" id="J-prev"></a><a href="#" class="next" id="J-next"></a></div>';

            sliderDOM.push('<div class="slider-holder" id="J-sliderHolder" style="display:none;">');
            sliderDOM.push('<div id="' + sliderID + '" class="goods-slider" style="overflow: hidden;"><ul id="' + sliderID + "_UL" + '">');
            sliderDOM.push(LIS + "</ul></div>");
            sliderDOM.push(nav_holder);
            sliderDOM.push('</div>');

            $("#J-popWrap").append(sliderDOM.join(""));
        } else {
            $("#" + sliderID+"_UL", "#content").html(LIS);
        }

        this.goodSlider = new Swipe(document.getElementById(sliderID), {
            fixWidth:284,
            preload:2
        });

        this.goodSlider.load();

        $("#J-prev").off("click");
        $("#J-next").off("click");
        $("#J-prev").on("click", function (e) {
            e.preventDefault();
            self.goodSlider.prev();
        });
        $("#J-next").on("click", function (e) {
            e.preventDefault();
            self.goodSlider.next();
        });

        this._showMask();
        this._bounceSlider();
    },

    destroyUI:function () {
        var self = this;
        $('body > div').click(function (ev) {
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toUpperCase() === 'DIV') {
                if ($(target).attr('id') == 'J-mask') {
                    self.goodSlider.destroy();
                    $("#J-sliderHolder").removeClass("bounceIn").addClass("bounceOut");
                    self._hideMask();
                }
            }
        });
    }

}