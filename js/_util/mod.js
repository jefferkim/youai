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

        //var url = U.parseUrl({"method":method, "itemId":cfg.itemId, "isvCode":cfg.isvCode}, $("#J_Sid").val());
        var url = U._devParseUrl(method+".json",{"itemId":cfg.itemId, "isvCode":cfg.isvCode}, $("#J_Sid").val());

        var success = (cfg.success || function (response) {
            if(response.ret[0].indexOf("SUCCESS::") != -1){
                $(t).trigger("changeUI");
            }
        });

        U.Ajax(url, success);
    },

    toggleAlbumLike:function(cfg){

        var self = this,
            U = Youai.Util,
            t = cfg.eventTarget,
            url = U._devParseUrl(($(t).hasClass("added")?"dumpAlbum.json":"likeAlbum.json"),{"albumId":cfg.albumId,"isvCode":cfg.isvCode});

        var success = (cfg.success || function(response){
            if(response.ret[0].indexOf("SUCCESS::") !=-1){
                $(t).trigger("changeUI");
            }
        });

        U.Ajax(url,success);
    }


}