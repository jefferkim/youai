Youai.albumList = Backbone.Collection.extend({

    initialize:function () {
    },

    model:Youai.Album,

    url:function () {
    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            //我关注的专辑数据接口是不一样的
            if (resp.data.method === "getLikeAlbums") {
                return _.flatten(_.pluck(resp.data.result.data, "records"), "albumId");
            } else {
                return resp.data.result.data;
            }
        }
    }

});