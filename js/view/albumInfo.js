/*
 * 专辑单个item
 *
 *
 * */

Youai.albumInfo = Backbone.View.extend({

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
        var target = e.currentTarget,
            likeNum = $(target).attr("data-likeNum");

        Youai.Mod.toggleAlbumLike({
            eventTarget:target,
            albumId:YA_GLOBAL.albumId,
            isvCode:YA_GLOBAL.isvCode,
            success:function (response) {
                if (response.ret[0].indexOf("SUCCESS::") != -1) {
                    $(target).toggleClass("added");
                    if (response.data.method === "likeAlbum") {
                        $(target).html("取消收集");
                    } else {
                        $(target).html("<em>收集</em><b>" + likeNum + "</b>");
                    }
                }
            }
        });

    },


    render:function (data) {
        this.$el.html(this.tpl["albumInfo"](data));
        return this;
    }

});