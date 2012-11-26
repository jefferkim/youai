Youai.Good = Backbone.Model.extend({

    defaults:{
    },

    url:function () {
    },

    getMainPic:function(){

      return _.filter(this.get("images"), function(image){ return image.type == 0; }); 

    },

    height:function () {
        var mainPic = this.getMainPic();
        return parseInt(150/(mainPic[0].width/mainPic[0].height));
    },

    _parsePrice:function () {
        return Youai.Util.toFixed(parseInt(this.get("originalPrice"))/100,2);
    },

    //单个good的iteminfo
    getItemInfo:function () {        
        var data = {
            "itemId":this.get("itemId"),
            "itemHeight":this.height(),
            "originalPrice":this._parsePrice(),
            "comment":this.get("comments") ? this.get("comments") : false, //comments对象存在的话弹出气泡评论
            "imgUrl":this.getMainPic()[0].url
        };
        return data;
    },

    //单个宝贝的图片的合集
    getItemList:function () {
        return {
            "images":this.get("images"),
            "likeNum":this.get("likeNum"),
            "isLiked":this.get("like") === "true",
            "itemId":this.get("itemId"),
            "isvCode":this.get("isvInfo").isvCode
        };
    },

    //获取这个宝贝的专辑信息
    getItemAlbumeInfo:function () {


    }

});