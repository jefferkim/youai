/*
 * Collection:GoodList=>Model:Good
 *
 * */


Youai.CommentList = Backbone.Collection.extend({

    initialize:function (op) {
        this.op = op;
    },

    model:Youai.Comment,

    url:function () {
        var U = Youai.Util;
        //  return U.parseUrl(U.urlMap["queryItemListByUserChannel"], "e2fdc60364a3a979d215dfcd1d85e50b");
        return U._devParseUrl("getItemComments.json", {"itemId":this.op.itemId, "pageSize":"10", "pageNo":this.op.pageNo});
    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            //return Youai.Util.dataParser(resp);
            return resp.data.result.comments;
        }
    }

});