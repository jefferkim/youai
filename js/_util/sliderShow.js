Youai.sliderShow = {

    init:function (id, model) {
        var self = this;
        this.maskEl = $("#J-mask"),
        this.goodSlider = null;

        this.model = model;
        
        this.renderUI(id);
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

    renderUI:function (sliderID) {

        
        var currentModel = this.model.toJSON();
        console.log("<<<<this model is ====");
        console.log(currentModel);
        console.log(">>>>this model is ====");
        var self = this;
        for (var i = 0, LIS = "", imgs = currentModel.images; i < imgs.length; i++) {
            LIS += '<li><img class="lazy" data-src="' + imgs[i].url + '_570x570.jpg" src="http://img01.taobaocdn.com/tps/i1/T1_uZXXj0cXXbQbJvh-50-52.png"/></li>';
        }
        

        if ($("#" + sliderID).length < 1) {
            var sliderDOM = [],
                operater =  '<div class="good-operater"><a href="#" class="J-like ' + (currentModel.like === "true" ? 'on' : '') + '"></a><span class="like-num"><em class="J-likeNum">' + currentModel.likeNum + '</em>人已喜欢</span></div>',
                nav_holder = '<div class="nav-holder"><a href="#" class="prev" id="J-prev"></a><a href="#" class="next" id="J-next"></a></div>';

            sliderDOM.push('<div class="slider-holder" id="J-sliderHolder" style="display:none;"><div class="sliderWrap">');
            sliderDOM.push('<div id="' + sliderID + '" class="goods-slider" style="overflow: hidden;"><ul id="' + sliderID + "_UL" + '">');
            sliderDOM.push(LIS + "</ul></div>");
            sliderDOM.push(operater+"</div>");
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
        $(".J-like").off("click");
        $(".J-like").on("click",function(e){
            e.preventDefault();
            if($(e.currentTarget).hasClass("disable")){
                notification.flash('接口请求有问题').show();
                return;
            }
            self.toggleLike(e);
        });
         
       // this.postStatistics(data);
        this._showMask();
        this._bounceSlider();
    },


    changeUI:function (target) {
        var model = this.model,
            operater = $(target).parents(".good-operater"),
            likebox = operater.find(".like-num"),
            likeNum = operater.find(".J-likeNum");

            $(target).toggleClass("on");
            $(target).removeClass("disable");

        var dest = $(target).hasClass("on") ? 1 : -1,
            num  = parseInt(model.get("likeNum")) + dest;
        
        likeNum.text(num);

        model.set({
          "like":$(target).hasClass("on"),
          "likeNum":num
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


    toggleLike:function(e){

        var self = this,
            target = e.currentTarget;     
         $(target).addClass("disable");
        var currentGoodInfo = this.model.getItemInfo(),

            method = $(target).hasClass("on") ? "dumpItem" : "likeItem";

console.log(currentGoodInfo);
            console.log("this actions is "+method );

        var url = {api:"com.taobao.wap.rest2.wo3",data:{"method":method, "itemId":currentGoodInfo.itemId, "isvCode":currentGoodInfo.isvCode}};
   
        Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function(response){
            if(response.ret[0].indexOf("SUCCESS::") != -1){
                    self.changeUI(target);
                }else{
                    notification.flash('接口调用错误，请刷新重试').show();
                }
            }
        )

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