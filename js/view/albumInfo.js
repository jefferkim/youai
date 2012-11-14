/*
 * 专辑单个item
 *
 *
 * */

Youai.albumInfo = Backbone.View.extend({

    el:"#content",

    tpl:{
        "albumItem":JST["template/album_info"]
    },

    events:{
        "click .comments":"showComment",
        "click .J-fav":"toggleFav"
    },

    initialize:function () {


    },

    showComment:function(e){
        e.preventDefault();
        new Youai.commentsView({
            commentUrl:Youai.Util._devParseUrl("getItemComments.json", {"itemId":111, "pageSize":"10", "pageNo":"1"})
        });
    },

    toggleFav:function(e){

        e.preventDefault();
        var target = e.currentTarget;
        var likeNum = parseInt($(target).attr("data-likeNum"));
        Youai.Mod.toggleAlbumLike({
            eventTarget:target,
            albumId:$(target).attr("data-albumId"),
            isvCode:$(target).attr("data-isvCode"),
            success:function (response) {
                if (response.ret[0].indexOf("SUCCESS::") != -1) {
                    $(target).toggleClass("added");
                    likeNum = likeNum + ($(target).hasClass("added") ? 1 : -1);
                    if (response.data.method === "likeAlbum") {
                        $(target).html("取消收集");
                    } else {
                        $(target).html("<em>收集</em><b>" + likeNum + "</b>");
                    }
                }
            }
        });

    },


    render:function (albumType) {

        return this.$el.html(this.tpl["albumItem"](this.model.getAlbums()));

    }



});