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

       // this.model.on("change",this.render,this);

    },


    replyComment:function (e) {
        e.preventDefault();
        var comment = this.model.toJSON(),
            input = $(".J-inputField","#J-tplComment");
        console.log(comment);
        $(".textarea-block","#J-tplComment").addClass("show");
        input.attr("data-replyId", comment.id);
        input.val("回复"+comment.user.userNick+":").focus();

    },


    render:function () {

        $("#J-tplComment").trigger("refreshIscroll");
        return this.$el.html(this.tpl["commentItem"](this.model.getComment()));

    }



});