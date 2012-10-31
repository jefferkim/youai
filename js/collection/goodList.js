/*
 * Collection:GoodList=>Model:Good
 *
 * */


Youai.GoodList = Backbone.Collection.extend({

    initialize:function (op) {
        this.op = op;
    },

    model:Youai.Good,

    url:function () {
        var U = Youai.Util;
        //  return U.parseUrl(U.urlMap["queryItemListByUserChannel"], "e2fdc60364a3a979d215dfcd1d85e50b");
        return U._devParseUrl("getItemsFromList.json", {"listCode":this.op.listCode, "pageSize":"10", "pageNo":this.op.pageNo});
    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {

            //return Youai.Util.dataParser(resp);

            return resp.data.result.data;
        }
    }

});