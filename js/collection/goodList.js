Youai.GoodList = Backbone.Collection.extend({

    initialize:function () {
    },

    model:Youai.Good,

    url:function () {
    },

    parse:function (resp) {
        Youai.Util._checkLogin(resp);
        var result = resp.data.result;
        if(resp.data.method === "getItemsFromList"){
            $("#J-headerT").text(result.title);
        }
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            new PageNav({'id':'#J-pageNav', 'pageCount':Math.ceil(result.recordTotal / 50), 'objId':'p'});
            return result.data;
        }
    }

});