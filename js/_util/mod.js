/*
 * Mod方法
 * 暂时加入
 *
 * */


Youai.Mod = {
    //增加喜欢和取消喜欢
    toggleLike:function (cfg) {
        console.log("mod toggleLike");

        var U = Youai.Util,
            t = cfg.eventTarget,
            method = $(t).hasClass("on") ? "dumpItem" : "likeItem";

        var url = {api:"com.taobao.wap.rest2.wo3",data:{"method":method, "itemId":cfg.itemId, "isvCode":cfg.isvCode}};
   
        Youai.mtopH5.getApi(url.api, "1.0", url.data, {},(cfg.success || function(response){
              if(response.ret[0].indexOf("SUCCESS::") != -1){
                $(t).trigger("changeUI");
            }
          })
        )
    },

    toggleAlbumLike:function(cfg){

        var self = this,
            U = Youai.Util,
            t = cfg.eventTarget,
            method = $(t).hasClass("added") ? "dumpAlbum" : "likeAlbum",
            
            url = {api:"com.taobao.wap.rest2.wo3",data:{"method":method,"albumId":cfg.albumId,"isvCode":cfg.isvCode}};

        Youai.mtopH5.getApi(url.api, "1.0", url.data, {},(cfg.success || function(response){
            if(response.ret[0].indexOf("SUCCESS::") !=-1){
                $(t).trigger("changeUI");
            }
          })
        );
    },

    popComment:function(){
        $(document.body).on("list:popcomment",function(e,_self){
            var comment = _self.parents("li").find(".pop-comment");
            _self.removeClass("hascomment");
            comment.show().animate({
                opacity:1
            }, 1000, 'ease', function () {
                var that = this;
                setTimeout(function () {
                    $(that).animate({
                        opacity:0
                    }, 500, 'ease', function () {
                        $(that).hide();
                    })
                }, 2000);
            })
        });
    },

    renderPageNav:function(total){
        if(total > 0){
            //pageNav组件增加destroy方法
            return new PageNav({'id':'#J-pageNav', 'pageCount':Math.ceil(total / 30), 'objId':'p'});
        }else{
            $("#J-pageNav").html("");
        }
    }

}