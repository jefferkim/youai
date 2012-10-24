/*
 * Collection:GoodList=>Model:Good
 *
 * */


Youai.GoodList = Backbone.Collection.extend({

    initialize:function () {

    },

    model:Youai.Good,

    url:function () {
        var U = Youai.Util;
      //  return U.assembleUrl(U.urlMap["queryItemListByUserChannel"], "e2fdc60364a3a979d215dfcd1d85e50b");

        return "json/list.json"
    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {

            //return Youai.Util.dataParser(resp);

            return resp.data.result.data;
        }
    }

});