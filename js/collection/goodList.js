Youai.GoodList = Backbone.Collection.extend({

    initialize:function () {
    },

    model:Youai.Good,

    url:function () {
    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            return resp.data.result.data;
        }
    }

});