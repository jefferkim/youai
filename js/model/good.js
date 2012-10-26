/*
 * Model:User
 * price:价格
 * pic:图片
 * comment:CF=>::宝贝列表页 ::列表页气泡浮出
 *
 *
 * */
Youai.Good = Backbone.Model.extend({

    defaults:{
        "flashComment":false, //是否提示气泡消息
        "albums":false
    },

    url:function(){
       /* var base = 'documents';
        if (this.isNew()) return base;
        return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;*/

        return "json/save.json";

    },


    height:function () {
        return this.get("images")[0].height;
    },


    _parsePrice:function () {
        return this.get("originalPrice") % 100;
    },

    /*单个good的iteminfo*/
    getItemInfo:function(){
        var data = {
            "itemId":this.get("itemId"),
            "originalPrice":this._parsePrice(),
            "comment":this.get("comments")?this.get("comments"):false,
            "imgUrl":this.get("images")[0].url
        };
        return data;
    },

    /*单个宝贝的图片的合集*/
    getItemList:function(){
        return {
           "images":this.get("images"),
           "likeNum":this.get("likeNum"),
           "isLiked":!!(this.get("like") === "true")
        };
    },

    /*获取这个宝贝的专辑信息*/
    getItemAlbumeInfo:function(){


    }






});