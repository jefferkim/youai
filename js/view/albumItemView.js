/*
 * 专辑单个item
 *
 *
 * */

Youai.albumItemView = Backbone.View.extend({

    tagName:"li",

    tpl:{
        "albumItem":JST["template/album_item"]
    },

    events:{
        "click .J-fav":"toggleFav",
        "changeUI .J-fav":"changeUI",
        "click .J-comment":"showComments"
    },

    initialize:function () {

        this.model.on("destroy",this._removeItem,this);

    },


    _removeItem:function(){
         var el = this.$el;
         el.animate({
             opacity:0
         },800,'ease',function(){
             el.remove();
         });
    },

    showComments:function(e){
        e.preventDefault();
        var U = Youai.Util;

        new Youai.commentsView({
            commentUrl:U._devParseUrl("getAblumComments.json", {"ablumId":111, "pageSize":"10", "pageNo":"1"})
        });

    },


    changeUI:function(){

        this.model.destroy();
    },
    //取消和添加收藏
    toggleFav:function (e) {
        e.preventDefault();
        var album = this.model.toJSON();
        Youai.Mod.toggleAlbumLike({
            eventTarget:e.currentTarget,
            itemId:album.albumId,
            isvCode:album.isvInfo.isvCode
        });
    },


    render:function (albumType) {

        return this.$el.html(this.tpl["albumItem"](this.model.getAlbums()));

    }



});