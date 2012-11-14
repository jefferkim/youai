Youai.albumList = Backbone.Collection.extend({

    initialize:function () {
    },

    model:Youai.Album,

    url:function () {
    },

    parse:function (resp) {
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            //我关注的专辑数据接口是不一样的
            var result = resp.data.result.data;
            new PageNav({'id':'#J-pageNav', 'pageCount':Math.ceil(resp.data.result.recordTotal / 30), 'objId':'p'});
            if (resp.data.method === "getLikeAlbums") {
                return _.flatten(_.pluck(result, "records"), "albumId");
            } else {
                return result;
            }
        }
    }

});