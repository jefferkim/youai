/*
 * 宝贝列表页
 * 传入model
 *
 * */

Youai.commentItemView = Backbone.View.extend({

    tagName:"li",
    //el:"#content",

    templates:{
        "list-commentItem":JST["template/comments_item"]
    },

    events:{
        "click .J-reply":"replyComment"
    },

    initialize:function () {

        // this.model.on("change",this.render,this);

    },


    replyComment:function (e) {
        e.preventDefault();
        Youai.Util.showAddTextarea();

        $("#J-val").attr("data-replyId", this.model.get("id"));
    },


    render:function () {

        return this.$el.html(this.templates["list-commentItem"](this.model.getComment()));

    }



});