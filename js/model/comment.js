/*
 * Model:comment
 * price:价格
 * pic:图片
 * comment:CF=>::宝贝列表页 ::列表页气泡浮出
 *
 *
 * */
Youai.Comment = Backbone.Model.extend({

    defaults:{

    },

    url:function () {
        /* var base = 'documents';
         if (this.isNew()) return base;
         return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + this.id;*/

        //return "json/save.json";

    },


    _getAvatar:function (id) {
        return "http://wwc.taobaocdn.com/avatar/getAvatar.do?userId=" + id + "&width=40&height=40&type=sns";
    },

    /*获取父级评论*/
    getSuperComment:function () {
        return {
           "author":this.get("superiors")["id"],
           "content":this.get("superiors")["content"]
        }

    },

    /*单个comment*/
    getComment:function () {
        var data = {
            "avatar":this._getAvatar(this.get("id")),
            "content":this.get("content"),
            "author":this.get("id"),
            "superComment":this.getSuperComment()
        };
        return data;
    }


});