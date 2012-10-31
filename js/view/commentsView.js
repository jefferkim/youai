/*
*
* */
Youai.commentsView = Backbone.View.extend({

    el:"#content",

    templates:{
        "comments-Layout":JST["template/comments-layout"],
        "comments-Item":JST["template/comments-item"]
    },

    events:{

    },

    initialize:function () {


    },


    addItem:function (comment) {

        var commentView = new Youai.commentItemView({model:comment});

        console.log(commentView.render());
        $("#J-comment").append(commentView.render());
    },




    render:function () {
        var self = this;

        this.$el.html(this.templates["comments-Layout"]());

        var commentList = this.collection;


        console.log(commentList.toJSON());

        commentList.each(function (comment) {
            self.addItem(comment);
        });

    }



});