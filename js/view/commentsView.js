/*
*
* */
Youai.commentsView = Backbone.View.extend({

    el:"#J-webapp",

    tpl:{
        "commentsLayout":JST["template/comments_layout"]
    },

    events:{
       "click #J-close":"closePop", //关闭pop层
       "click #J-submit":"submitComment"//提交评论
    },

    initialize:function (options) {

        $("#J-mask").show().animate({
            opacity:0.8
        }, 1000, 'ease');

        if($("#J-tplComment").length > 0){
            $("#J-tplComment").show()
        }else{
            $("#J-popWrap").html(this.tpl["commentsLayout"]());
            $("#J-comment-block").height(window.innerHeight-100)
        }

       this.commentList = new Youai.CommentList();
       this.commentList.url = options.commentUrl;

       this.commentList.fetch();

       this.commentList.on('reset', this.render, this);

    },


    closePop:function(e){
        e.preventDefault();
        $("#J-mask").animate({
            opacity:0
        }, 1000, 'ease', function () {
            $(this).hide();
        });
        $("#J-tplComment").hide();
        $("#J-comment","#J-tplComment").html("");
    },

    submitComment:function (e) {
        e.preventDefault();
        var self = this,
            U = Youai.Util;

        var commentBlock = $(".textarea-block","#J-tplComment"),
            inputField = $(".J-inputField","#J-tplComment");

        if (inputField.val() === "") {
            notification.pop("请填写评论内容").show();
            return;
        }
        else {

            var url = U._devParseUrl("addCommentForItem.json",{
                "method":"addCommentForItem",
                "content":inputField.val(),
                "itemId":location.hash.split("/")[1],//链接中取得
                "commentParentId":inputField.attr("data-replyId")
            });

            var success = function (response) {
                var result = response.ret[0];
                if (result.indexOf("DUPLICATE_DATA::") != -1) {
                  // pop("评论重复或过于频繁哦");
                }
                if (result.indexOf("PARAM_ERR::") != -1) {
                  //  pop("输入参数错误");
                }
                if(result.indexOf("SUCCESS::") != -1){

                    var newComment = new Youai.Comment({
                        itemId:location.hash.split("/")[1],
                        content:inputField.val(),
                        user: {
                            userId:response.data.user.userId,  //隐藏域
                            userNick:response.data.user.userNick//隐藏域
                        }
                    });

                    self.addComment(newComment,"reply");
                    self.commentScroll._scrollbarPos(0,0);

                    commentBlock.removeClass("show");
                    inputField.val("");
                }
            };

            Youai.Util.Ajax(url, success);

        }
    },


    addComment:function (comment) {

        var commentView = new Youai.commentItemView({model:comment});

        var commentListWrap = $("#J-comment","#J-tplComment");

        if(arguments[1]){
            commentListWrap.prepend(commentView.render());
        }else{
            $("#J-comment","#J-tplComment").append(commentView.render());
        }

    },


    render:function () {

        var self = this;

        this.commentList.each(function (comment) {
            self.addComment(comment);
        });

        this.commentScroll = new iScroll('J-comment-block');
        //comment评论时高度会有变化
        $("#J-tplComment").on("refreshIscroll",function(){
            setTimeout(function(){
                self.commentScroll.refresh();
            },500);
        })
    }

});