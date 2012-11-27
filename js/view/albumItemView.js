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
            album = this.model.toJSON();
        Youai.Mod.toggleAlbumLike({
            eventTarget:e.currentTarget,
            albumId:album.albumId,
            isvCode:album.isvInfo.isvCode,
            success:function (response) {
                Youai.Util._checkLogin(response);
                if (response.ret[0].indexOf("SUCCESS::") != -1) {
                    $(target).toggleClass("added");
                    if (albumsType === "recommend") {
                        //喜欢后文案显示为取消收集
                        //取消收集后数字在没刷新前提下跟先前收集前一致，所以没set Model
                        if (response.data.method === "likeAlbum") {
                            $(target).html("取消收集");
                        } else {
                            $(target).html("<em>收集</em><b>" + album.likeNum + "</b>");
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