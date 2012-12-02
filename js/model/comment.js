Youai.Comment = Backbone.Model.extend({

    defaults:{
    },

    url:function () {
    },


    validate: function(attrs) {
        if ($.trim(attrs.content).replace("/[^/x00-/xff]/g", "**").length > 140) {
            return "不能超出140个字数";
        }
    },

    _getAvatar:function (id) {
        return "http://wwc.taobaocdn.com/avatar/getAvatar.do?userId=" + id + "&width=80&height=80&type=sns";
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
            "userId":this.get("user").userId,
            "author":this.get("user").userNick,
            "commentId":this.get("id")
        };
        return data;
    }
});