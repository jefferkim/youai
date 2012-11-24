Youai.albumList = Backbone.Collection.extend({

    initialize:function () {
    },

    model:Youai.Album,

    url:function () {
    },

    parse:function (resp) {
        Youai.Util._checkLogin(resp);
        if (resp.ret[0].indexOf("SUCCESS::") != -1) {
            //我关注的专辑数据接口是不一样的
            var result = resp.data.result.data,
                totalRecord = resp.data.result.recordTotal;
                console.log(totalRecord);
            if(totalRecord > 0){
                new PageNav({'id':'#J-pageNav', 'pageCount':Math.ceil(totalRecord / 30), 'objId':'p'});
            }            
            if (resp.data.method === "getLikeAlbums") {
                return _.flatten(_.pluck(result, "records"), "albumId");
            } else {
                return result;
            }
        }
    }

});