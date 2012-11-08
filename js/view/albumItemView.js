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


    //取消和添加收藏
    toggleFav:function (e) {
        e.preventDefault();

        var self = this,
            U = Youai.Util,
            target = e.currentTarget,
            url = U._devParseUrl(($(target).hasClass("added")?"dumpAlbum.json":"likeAlbum.json"),{"albumId":"464564","isvCode":"1"});

        var success = function(response){
            if(response.ret[0].indexOf("SUCCESS::") !=-1){
                self.model.destroy();
            }
        }

        U.Ajax(url,success);

    },


    render:function (albumType) {

        return this.$el.html(this.tpl["albumItem"](this.model.getAlbums()));

    }



});