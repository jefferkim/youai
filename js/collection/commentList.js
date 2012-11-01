/*
 * Collection
 *
 * */


Youai.CommentList = Backbone.Collection.extend({

    initialize:function () {


    },

    model:Youai.Comment,

    url:function () {

        //  return U.parseUrl({"method":"getItemComments","itemId":this.op.itemId,"pageSize":"10","pageNo":this.op.pageNo});
    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            return resp.data.result.comments;
        }
    }

});