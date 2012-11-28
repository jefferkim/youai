Youai.albumItemView = Backbone.View.extend({

    tagName:"li",

    tpl:{
        "albumItem":JST["template/album_item"]
    },

    events:{
        "click .J-fav":"toggleFav"
    },

    initialize:function () {
        this.model.on("destroy", this._removeItem, this);
    },

    _removeItem:function () {
        var el = this.$el;
        el.animate({
            opacity:0
        }, 800, 'ease', function () {
            el.remove();
        });
    },

    //取消和添加收藏
    toggleFav:function (e) {
        e.preventDefault();
        var self = this,
            target = e.currentTarget,
            albumsType = location.hash.split("/")[1],
            album = this.model.toJSON(),
            likeNum = parseInt(album.likeNum);
        Youai.Mod.toggleAlbumLike({
            eventTarget:e.currentTarget,
            albumId:album.albumId,
            isvCode:album.isvInfo.isvCode,
            success:function (response) {
                Youai.Util._checkLogin(response);
                if (response.ret[0].indexOf("SUCCESS::") != -1) {
                    $(target).toggleClass("added");
                    if (albumsType === "recommend") {
                        if (response.data.method === "likeAlbum") {
                            $(target).html("取消收集");
                            self.model.set({
                                "likeNum":likeNum + 1,
                                "like":"true"
                            });
                        } else {
                            self.model.set({
                                "likeNum":likeNum - 1,
                                "like":"false"
                            });
                            $(target).html("<em>收集</em><b>" + (likeNum - 1) + "</b>");
                        }
                    } else {
                        self.model.destroy();
                    }
                }else{
                    notification.flash('接口调用错误，请刷新重试').show();
                }
            }
        });
    },


    render:function (albumType) {

        return this.$el.html(this.tpl["albumItem"](this.model.getAlbums()));

    }

});