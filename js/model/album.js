/*
 * Model:Album
 *
 *
 * */
Youai.Album = Backbone.Model.extend({

    defaults:{

    },

    url:function () {

    },

    /*单个Album*/
    getAlbum:function () {

        var data = {
            "title":this.get("title"),
            "description":this.get("description"),
            "goodNum":this.get("goodNum"),
            "commentNum":this.get("commentNum"),
            "isLiked":this.get("like") === "true" ? true : false,
            "likeNum":this.get("likeNum"),
            "albumPic":this.get("images")[0].url
        };

        return data;
    }

});