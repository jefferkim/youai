/*
 * Mod方法
 * 暂时加入
 *
 * */


Youai.Mod = {
    //增加喜欢和取消喜欢
    toggleLike:function (cfg) {

        var t = cfg.eventTarget,
            method = $(t).hasClass("on") ? "deleteItemById" : "addItemById";


        var url = Youai.Util.parseUrl({"method":method, "itemId":cfg.itemId, "isvCode":cfg.isvCode}, $("#J_Sid").val());

        var success = function (response) {
            if(response.ret[0].indexOf("SUCCESS::") != -1){
                $(t).trigger("changeUI");
                if(method === "addItemById"){

                }

                $("#J_FeedList").trigger("E_AddLikeTips");

            }
        };

        U.Ajax(url, success);
    }


}