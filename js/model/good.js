Youai.Good = Backbone.Model.extend({

    defaults:{
    },

    url:function () {
    },

    getMainPic:function(){
      //the main pic is flagged  with {type:0}
      return _.find(this.get("images"), function(image){ return image.type == 0; });
    },

    height:function () {
        var mainPic = this.getMainPic();
        return parseInt(150*mainPic.height/mainPic.width);
    },

    _parsePrice:function () {
        return Youai.Util.toFixed(parseInt(this.get("originalPrice"))/100,2);
    },

    //itemInfo for single item
    getItemInfo:function () {
        return {
            "itemId":this.get("itemId"),
            "albumId":this.get("album") ? this.get("album").albumId : YA_GLOBAL.albumId,  //后端没有返回严格的Good的模型
            "isvCode":this.get("isvInfo").isvCode,
            "itemHeight":this.height(),
            "originalPrice":this._parsePrice(),
            "scm":this.get("scm")?"1007."+this.get("scm")+".0.0":"0.0.0.0",
            "comment":this.escape("comments") ? Youai.Util.cutstr(this.escape("comments"),50) : false, //过滤html标签,comments对象存在的话弹出气泡评论
            "imgUrl":this.getMainPic().url
        }
    },

    //单个宝贝的图片的合集
    getItemList:function () {
        return {
            "itemId":this.get("itemId"),
            "images":this.get("images"),
            "likeNum":this.get("likeNum"),
            "isLiked":this.get("like") === "true",            
            "isvCode":this.get("isvInfo").isvCode
        }
    },

    //获取这个宝贝的专辑信息
    getItemAlbumeInfo:function () {


    }

});