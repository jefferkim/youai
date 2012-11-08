/*
*
* */
Youai.commentsView = Backbone.View.extend({

    el:"#content",

    tpl:{
        "commentsLayout":JST["template/comments_layout"]
    },

    events:{
       "click #J-close":"closePop", //关闭pop层
       "click #J-submit":"submitComment"//提交评论
    },

    initialize:function (options) {

       $("#J-mask").show();

       $("#J-tplComment").length > 0 ? $("#J-tplComment").show() : this.$el.append(this.tpl["commentsLayout"]());

       this.commentList = new Youai.CommentList();
       this.commentList.url = options.commentUrl;

       this.commentList.fetch();

       this.commentList.on('reset', this.render, this);

    },


    closePop:function(e){
        e.preventDefault();
        $("#J-mask").hide();
        $("#J-tplComment").hide();
        $("#J-comment","#J-tplComment").html("");
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

            //获得当前的comment模型
            var oldComment = this.commentList.get(inputField.attr("data-replyId"));

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

                    oldComment.set({
                        content: inputField.val(),
                        superiors: {
                            content: oldComment.get("content"),
                            id:oldComment.get("id"),
                            user: {
                                userId: oldComment.get("user").userId,
                                userNick: oldComment.get("user").userNick
                            }
                        },
                        user: {
                            userId:response.data.result.user.userId,  //隐藏域
                            userNick:response.data.result.user.userNick//隐藏域
                        }
                    });

                    commentBlock.removeClass("show");
                    inputField.val("");
                }
            };

            Youai.Util.Ajax(url, success);

        }
    },


    addItem:function (comment) {

        var commentView = new Youai.commentItemView({model:comment});

        $("#J-comment","#J-tplComment").append(commentView.render());
    },


    render:function () {

        var self = this;

        this.commentList.each(function (comment) {
            self.addItem(comment);
        });

        var commentScroll = new iScroll('J-comment-block');
        //comment评论时高度会有变化
        $("#J-tplComment").on("refreshIscroll",function(){
            setTimeout(function(){
                commentScroll.refresh();
            },500);
        })
    }

});