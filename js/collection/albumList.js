/*
 * Collection
 *
 * */


Youai.albumList = Backbone.Collection.extend({

    initialize:function () {


    },

    model:Youai.Album,

    url:function () {


    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            return resp.data.result.data;
        }
    }

});