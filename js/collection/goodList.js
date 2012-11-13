Youai.GoodList = Backbone.Collection.extend({

    initialize:function () {
    },

    model:Youai.Good,

    url:function () {
    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            new PageNav({'id':'#J-pageNav', 'pageCount':Math.ceil(resp.data.result.recordTotal / 30), 'objId':'p'});
            return resp.data.result.data;
        }
    }

});