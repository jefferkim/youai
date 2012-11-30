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
            "albumId":this.get("album") ? this.get("album").albumId : YA_GLOBAL.albumId,  //后端没有返回严格的Good的模型
            "isvCode":this.get("isvInfo").isvCode,
            "itemHeight":this.height(),
            "originalPrice":this._parsePrice(),
            "comment":this.get("comments") ? Youai.Util.cutstr(this.get("comments"),25) : false, //comments对象存在的话弹出气泡评论
            "imgUrl":this.getMainPic()[0].url
        };
        return data;
    },

    //单个宝贝的图片的合集
    getItemList:function () {
        return {
            "modelIndex":this.cid.split("c")[1],
            "itemId":this.get("itemId"),
            "images":this.get("images"),
            "likeNum":this.get("likeNum"),
            "isLiked":this.get("like") === "true",            
            "isvCode":this.get("isvInfo").isvCode
        };
    },

    //获取这个宝贝的专辑信息
    getItemAlbumeInfo:function () {


    }

});