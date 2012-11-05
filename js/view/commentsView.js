/*
*
* */
Youai.commentsView = Backbone.View.extend({

    el:"#content",

    templates:{
        "comments-Layout":JST["template/comments_layout"],
        "add-Comments":JST["template/add_comment"]
    },

    events:{
       "click #J-close":"closePop",
        "click #J-submit":"submitComment"//提交评论
    },

    initialize:function () {


    },


    closePop:function(){


    },

    submitComment:function (e) {
        e.preventDefault();
        var U = Youai.Util;

        if ($("#J-val").val() === "") {
            //pop("")//提示错误
            return false;
        }
        else {

            var submitModel = {
                "method":"addCommentForItem",
                "content":$("#J-val").val(),
                "itemId":$("#J-itemId").val(),//链接中取得
                "commentParentId":$("#J-val").attr("data-replyId")
            }

            var url = U.parseUrl(submitModel, "111111");

            var success = function (response) {
                var result = response.ret[0];
                if (result.indexOf("DUPLICATE_DATA::") != -1) {
                  // pop("评论重复或过于频繁哦");
                }
                if (result.indexOf("PARAM_ERR::") != -1) {
                  //  pop("输入参数错误");
                }
                if(result.indexOf("SUCCESS::") != -1){
                    console.log(response);



                }

            };

            Youai.Util.Ajax(url, success);
        }
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