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
        var self = this,
            commentUrl,
            U = Youai.Util;

        $("#J-mask").show().css({
            height:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)
        }).animate({
            opacity:0.8
        }, 1000, 'ease');

        if($("#J-tplComment").length > 0){
            $("#J-tplComment").show()
        }else{
            $("#J-popWrap").html(this.tpl["commentsLayout"]());
            $("#J-comment-block").height(window.innerHeight-100)
        }

        this.options = options;

        if(options.method === "getAblumComments"){
            commentUrl = U.parseUrl({"method":"getAblumComments","albumId":YA_GLOBAL.albumId,"isvCode":YA_GLOBAL.isvCode,"pageSize":"100","pageNo":"1"});
        }else{
            commentUrl = U.parseUrl({"method":"getItemComments","itemId":YA_GLOBAL.itemId,"isvCode":YA_GLOBAL.isvCode,"pageSize":"100","pageNo":"1"});
        }

       this.commentList = new Youai.CommentList();

        U.Ajax(commentUrl,function(resp){
            if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                self.commentList.reset(resp.data.result.comments);
                self.render();
            }
        });
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
            url,
            U = Youai.Util;

        var commentBlock = $(".textarea-block","#J-tplComment"),
            inputField = $(".J-inputField","#J-tplComment"),
            inputContent = $.trim(inputField.val());

        if ($.trim(inputField.val()) === "") {
            notification.pop("请填写评论内容").show();
            return;
        }
        else {
            if(this.options.method == "getAblumComments"){
                url = U.parseUrl({"method":"addCommentForAblum","albumId":YA_GLOBAL.albumId,"content":inputContent,"isvCode":YA_GLOBAL.isvCode});
            }else{
                url = U.parseUrl({"method":"addCommentForItem","itemId":YA_GLOBAL.itemId,"content":inputContent,"isvCode":YA_GLOBAL.isvCode});
            }

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
                    var newComment = new Youai.Comment({
                        itemId:YA_GLOBAL.itemId,
                        content:inputField.val(),
                        user: {
                            userId:response.data.result.user.userId,  //隐藏域
                            userNick:response.data.result.user.userNick//隐藏域
                        }
                    });

                    self.addComment(newComment,"reply");
                    self.commentScroll._scrollbarPos(0,0);

                    commentBlock.removeClass("show");
                    inputField.val("");
                }
            };

            U.Ajax(url, success);

        }
    },


    addComment:function (comment) {

        var commentView = new Youai.commentItemView({model:comment});

        var commentListWrap = $("#J-comment","#J-tplComment");

        if(arguments[1]){
            commentListWrap.prepend(commentView.render());
        }else{
            //TODO:减少reflow
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