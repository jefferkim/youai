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
       "click #J-close":"closePop"
    },

    initialize:function () {


    },


    closePop:function(){


    },



    addItem:function (comment) {

        var commentView = new Youai.commentItemView({model:comment});

        $("#J-comment").append(commentView.render());
    },




    render:function () {
        var self = this;

        $("#J-mask").show();

        this.$el.html(this.templates["comments-Layout"]());


        var commentList = this.collection;



       commentList.each(function (comment) {
            self.addItem(comment);
        });

        new iScroll('J-comment-block');

    }



});