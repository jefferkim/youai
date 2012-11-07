Youai.Good = Backbone.Model.extend({

    defaults:{
    },

    url:function () {
    },

    height:function () {
        return this.get("images")[0].height;
    },

    _parsePrice:function () {
        return parseInt(this.get("originalPrice")) % 100;
    },

    //单个good的iteminfo
    getItemInfo:function () {
        var data = {
            "itemId":this.get("itemId"),
            "originalPrice":this._parsePrice(),
            "comment":this.get("comments") ? this.get("comments") : false, //comments对象存在的话弹出气泡评论
            "imgUrl":this.get("images")[0].url
        };
        return data;
    },

    //单个宝贝的图片的合集
    getItemList:function () {
        return {
            "images":this.get("images"),
            "likeNum":this.get("likeNum"),
            "isLiked":this.get("like") === "true"
        };
    },

    //获取这个宝贝的专辑信息
    getItemAlbumeInfo:function () {


    }

});