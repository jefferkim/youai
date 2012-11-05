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
       "click #J-close":"closePop", //关闭pop层
       "click #J-submit":"submitComment"//提交评论
    },

    initialize:function () {

       this.commentList = new Youai.CommentList();
       this.commentList.url = Youai.Util._devParseUrl("getItemComments.json", {"itemId":111, "pageSize":"10", "pageNo":1});

       this.commentList.fetch();
       this.commentList.on('reset', this.render, this);

    },


    closePop:function(e){
        e.preventDefault();
        $("#J-mask").hide();
        $("#J-tplComment").hide();

    },

    submitComment:function (e) {
        e.preventDefault();
        var U = Youai.Util;

        var commentBlock = $(".textarea-block","#J-tplComment"),
            inputField = $(".J-inputField","#J-tplComment");

        if (inputField.val() === "") {
            notification.pop("请填写评论内容").show();
            return;
        }
        else {

            var submitModel = {
                "method":"addCommentForItem",
                "content":inputField.val(),
                "itemId":location.hash.split("/")[1],//链接中取得
                "commentParentId":inputField.attr("data-replyId")
            }

            var oldComment = this.commentList.get(inputField.attr("data-replyId"));

            oldComment.set({
                content: inputField.val(),
                superiors: {
                    content: inputField.val(),
                    user: {
                        userId: oldComment.get("user").userId,
                        userNick: oldComment.get("user").userNick
                    }
                },
                user: {
                    userId: 11111,
                    userNick:"jinjianfeng"
                }
            });



            console.log(submitModel);
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

                    commentBlock.removeClass("show");
                    inputField.val("");


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

        this.commentList.each(function (comment) {
            self.addItem(comment);
        });

        new iScroll('J-comment-block');
    }

});