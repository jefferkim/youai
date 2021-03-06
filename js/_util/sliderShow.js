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
            this.doLikeAction();
        }


        this.mainVer = "v";
        if((/android/gi).test(navigator.appVersion)){
            var android = navigator.userAgent.match(/(Android)\s+([\d.]+)/);
            this.mainVer = android[2].replace(/^(\d\.\d).*$/, '$1');
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
        this.maskEl.hide();
    },

    _bounceSlider:function () {
        var sliderEL = $("#J-sliderHolder");
        var sliderH = 325;
        sliderEL.css({"top":document.body.scrollTop + (window.innerHeight-sliderH)/2});
        sliderEL.show();

       if(this.mainVer != "v"){
           $("#J-sliderHolder").show();
       }else{
            sliderEL.removeClass("bounceOut").addClass("bounceIn");
       }

    },

    renderUI:function (sliderID) {

        var self = this,
            currentModel = this.model.toJSON();

        //TODO:查看是否有album字段
        var sliderDOM = JST["template/slider"]({ID:sliderID,images:currentModel.images,isLiked:currentModel.like === "true",albumId:currentModel.album?currentModel.album.albumId :YA_GLOBAL.albumId});

        $("#J-popWrap").html(sliderDOM);

        this.goodSlider = new Swipe($("#"+sliderID)[0], {
            fixWidth:284,
            preload:2,
            lazyloadClass:"lazyImg"
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


    doLikeAction:function(){
        var self = this;
        $(".J-like").off("click");
        $("#J-webapp").undelegate(".J-like","click");
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
            if(method == "dumpItem"){
                likebox.text("成功取消");
            }else{
                likebox.text("成功收藏");
            }

            $(target).toggleClass("on");
            $(target).removeClass("disable");
        //设置模型
        model.set({
          "like": method=="dumpItem" ? "false" : "true"
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
        var url = {api:"com.taobao.wap.rest2.wo3",data:{"method":method, "itemId":currentGoodInfo.itemId, "isvCode":currentGoodInfo.isvCode , "albumId":currentGoodInfo.albumId}};
   
        Youai.mtopH5.getApi(url.api, "1.0", url.data, {}, function(response){
            Youai.Util._checkLogin(response);
            if(response.ret[0].indexOf("SUCCESS::") != -1){
                    self.changeUI(target,response.data.method);
                }else{
                    notification.flash('请刷新重试').show();
                }
            }
        )

    },
    destroyUI:function () {
        var self = this;

        $("#J-mask").on("click",function(){
            self.goodSlider.destroy();
             if(self.mainVer != "v"){
                 $("#J-sliderHolder").hide();
             }else{
                 $("#J-sliderHolder").removeClass("bounceIn").addClass("bounceOut");
             }
            self._hideMask();
        });
    }

}