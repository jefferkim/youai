Youai.sliderShow = {

    init:function (id, model,likeAction) {
        var self = this;
        this.maskEl = $("#J-mask"),
        this.goodSlider = null;

        this.model = model;
        
        this.renderUI(id);
        this.destroyUI();
        if(likeAction){
            likeAction();
        }else{
            this.likeAction();
        }

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

        var self = this,
            currentModel = this.model.toJSON();
        console.log("<<<<this model is ====");
        console.log(currentModel);
        console.log(">>>>this model is ====");
        //TODO:查看是否有album字段

        var sliderDOM = JST["template/slider"]({ID:sliderID,images:currentModel.images,isLiked:currentModel.like === "true",albumId:currentModel.album.albumId?currentModel.album.albumId :0});

        $("#J-popWrap").html(sliderDOM);

        this.goodSlider = new Swipe($("#"+sliderID)[0], {
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


         
        this.postStatistics();
        this._showMask();
        this._bounceSlider();
    },


    likeAction:function(){
        var self = this;
        $(".J-like").off("click");
        $(".J-like").on("click",function(e){
            e.preventDefault();
            //暂时去掉disable状态
            if($(e.currentTarget).hasClass("disable")){
                notification.flash('请求太频繁').show();
                return;
            }
            self.toggleLike(e);
        });
    },

    changeUI:function (target,method) {
        var timer,
            model = this.model,
            operater = $(target).parents(".good-operater"),
            likebox = operater.find(".like-num");
            if(method === "dumpItem"){
                likebox.text("成功取消");
            }else{
                likebox.text("成功收藏");
            }

            $(target).toggleClass("on");
            $(target).removeClass("disable");

        model.set({
          "like":$(target).hasClass("on")
        });

        clearTimeout(timer);
        likebox.animate({ "opacity":1,"right":40}, 200, (.47,.2,0,.92), function () {
            var othis = $(this);
            timer = setTimeout(function () {
                othis.animate({"opacity":0,"right":60},200,(.47,.2,0,.92),function(){
                    othis.css({
                        right:0
                    });
                });
            }, 2000);
        });
    },


    toggleLike:function(e){
        var self = this,
            target = e.currentTarget;

        $(target).addClass("disable");

        var currentGoodInfo = this.model.getItemInfo(),
            method = $(target).hasClass("on") ? "dumpItem" : "likeItem";
        console.log("this actions is "+method );

        var url = {api:"com.taobao.wap.rest2.wo3",data:{"method":method, "itemId":currentGoodInfo.itemId, "isvCode":currentGoodInfo.isvCode}};
   
        Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function(response){
            Youai.Util._checkLogin(response);
            if(response.ret[0].indexOf("SUCCESS::") != -1){
                    self.changeUI(target,response.data.method);
                }else{
                    notification.flash('接口调用错误，请刷新重试').show();
                }
            }
        )

    },
    //打点，统计点击次数
    postStatistics:function(data){
        var host = location.hostname.match(/$|\.(?:m|waptest|wapa)\.taobao\.com/gi);
        $.ajax({
            url:'http://wo.'+host[0]+'/operation.htm',
            data:{pds:"list_gotolargepic#h#youai"},
            success:function(){

            }
        });

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