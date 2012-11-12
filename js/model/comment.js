Youai.Comment = Backbone.Model.extend({

    defaults:{
    },

    url:function () {
    },

    _getAvatar:function (id) {
        return "http://wwc.taobaocdn.com/avatar/getAvatar.do?userId=" + id + "&width=40&height=40&type=sns";
    },

    /*获取父级评论*/
    getSuperComment:function () {
        return (this.get("superiors")["id"] != undefined) ? {
            "author":this.get("superiors").user["userNick"],
            "content":this.get("superiors").content
        } : false
    },

    /*单个comment*/
    getComment:function () {
        var data = {
            "avatar":this._getAvatar(this.get("user").userId),
            "content":this.get("content"),
            "author":this.get("user").userNick,
            "commentId":this.get("id")
        };
        return data;
    }
});