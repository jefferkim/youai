Youai.sliderShow = {

    init:function (id, data) {
        var self = this;
        this.maskEl = $("#J-mask"),
        this.goodSlider = null;
        
        this.renderUI(id, data);
        this.destroyUI();
    },

    _showMask:function () {
        this.maskEl.css({
            height:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)
        }).show().animate({
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
                + (i == 0 ? '<span class="good-operater"><a href="#" class="J-like ' + (data.isLiked ? 'on' : '') + '"'+(data.itemId ? 'data-itemId="'+data.itemId+'"':'')+'></a><span class="like-num"><em class="J-likeNum">' + data.likeNum + '</em>人已喜欢</span></span>' : "")
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
            $("#" + sliderID+"_UL", "#J-webapp").html(LIS);
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

        this.postStatistics(data);
        this._showMask();
        this._bounceSlider();
    },
    //打点，统计点击次数
    postStatistics:function(data){
       
        console.log(data);
        $.post('zoom.json', {}, function(){});

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