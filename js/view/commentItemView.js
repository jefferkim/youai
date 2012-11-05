/*
 * 宝贝列表页
 * 传入model
 *
 * */

Youai.commentItemView = Backbone.View.extend({

    tagName:"li",

    tpl:{
        "commentItem":JST["template/comments_item"]
    },

    events:{
        "click .J-reply":"replyComment"
    },

    initialize:function () {

        this.model.on("change",this.render,this);

    },


    replyComment:function (e) {
        e.preventDefault();
        $(".textarea-block","#J-tplComment").addClass("show");
        $(".J-inputField","#J-tplComment").attr("data-replyId", $(e.currentTarget).attr("data-id"));
    },


    render:function () {

        $("#J-tplComment").trigger("refreshIscroll");
        return this.$el.html(this.tpl["commentItem"](this.model.getComment()));

    }



});