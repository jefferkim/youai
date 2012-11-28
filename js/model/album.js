Youai.Album = Backbone.Model.extend({

    defaults:{

    },

    url:function () {
    },

    /*查询推荐的专辑列表或者用户关注列表*/
    getAlbums:function () {
        var data = {
            "albumId":this.get("albumId"),
            "title":this.get("title"),
            "description":this.get("description"),
            "goodNum":this.get("goodNum"),
            "commentNum":this.get("commentNum"),
            "isLiked":this.get("like") === "true",
            "likeNum":this.get("likeNum"),
            "itemTotal":this.get("itemTotal"),
            "albumPic":this.get("images")[0].url
        };
        return data;
    },

    getAlbumInfo:function(){
        var data = {
            "user":this.get("user"),
            "likeNum":this.get("likeNum"),
            "isLiked":this.get("like") === "true",
            "commentNum":this.get("commentNum"),
            "description":this.get("description")
        };
        return data;
    }

});