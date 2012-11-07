Youai.CommentList = Backbone.Collection.extend({

    initialize:function () {
    },

    model:Youai.Comment,

    url:function () {
    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            return resp.data.result.comments;
        }
    }
});