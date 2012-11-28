Youai.albumInfoView = Backbone.View.extend({

    tagName:"div",

    className:"album-info",

    tpl:{
        "albumInfo":JST["template/album_info"]
    },

    events:{
        "click .comments":"showComment",
        "click .J-fav":"toggleFav"
    },

    initialize:function () {

    },

    showComment:function (e) {
        e.preventDefault();
        var target = e.currentTarget;

        new Youai.commentsView({
            "method":"getAblumComments"
        });
    },

    toggleFav:function (e) {
        e.preventDefault();
        var self = this,
            currentModel = this.model.toJSON(),
            target = e.currentTarget,
            likeNum = parseInt(currentModel.likeNum),
            method = $(target).hasClass("added") ? "dumpAlbum" : "likeAlbum",
            url = {api:"com.taobao.wap.rest2.wo3", data:{"method":method, "albumId":currentModel.albumId, "isvCode":currentModel.isvInfo.isvCode}};

        Youai.mtopH5.getApi(url.api, "1.0", url.data, {},
            function (response) {
                Youai.Util._checkLogin(response);
                if (response.ret[0].indexOf("SUCCESS::") != -1) {
                    $(target).toggleClass("added");
                    if (response.data.method === "likeAlbum") {
                        $(target).html("取消收集");
                        self.model.set({
                            "likeNum":likeNum + 1
                        });
                    } else {
                        self.model.set({
                            "likeNum":likeNum - 1
                        });
                        $(target).html("<em>收集</em><b>" + (likeNum - 1) + "</b>");
                    }
                }
            }
        )
    },


    render:function () {
        this.$el.html(this.tpl["albumInfo"](this.model.getAlbumInfo()));
        return this;
    }

});