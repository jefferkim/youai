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
            commentUrl = {api:"com.taobao.wap.rest2.wo3",data:{"method":"getAblumComments","albumId":YA_GLOBAL.albumId,"isvCode":YA_GLOBAL.isvCode,"pageSize":"100","pageNo":"1"}};
        }else{
            commentUrl = {api:"com.taobao.wap.rest2.wo3",data:{"method":"getItemComments","itemId":YA_GLOBAL.itemId,"isvCode":YA_GLOBAL.isvCode,"pageSize":"100","pageNo":"1"}};
        }

       this.commentList = new Youai.CommentList();

        Youai.mtopH5.getApi(commentUrl.api, "1.0", commentUrl.data, {},function (resp) {            
            if (resp.ret[0].indexOf("SUCCESS::") != -1) {
                self.commentList.reset(resp.data.result.comments);
                self.render();
            }else{
                notification.flash('接口调用错误，请刷新重试').show();
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
                url = {api:"com.taobao.wap.rest2.wo3",data:{"method":"addCommentForAblum","albumId":YA_GLOBAL.albumId,"content":inputContent,"isvCode":YA_GLOBAL.isvCode}};
            }else{
                url = {api:"com.taobao.wap.rest2.wo3",data:{"method":"addCommentForItem","itemId":YA_GLOBAL.itemId,"content":inputContent,"isvCode":YA_GLOBAL.isvCode}};
            }
           
            Youai.mtopH5.getApi(url.api, "1.0", url.data, {},function (response) {
                Youai.Util._checkLogin(response);
                var result = response.ret[0];
                if (result.indexOf("DUPLICATE_DATA::") != -1) {
                    notification.flash('评论重复或过于频繁哦').show();
                }
                if (result.indexOf("PARAM_ERR::") != -1) {
                    notification.flash('输入参数错误').show();
                }
                
                if(result.indexOf("SUCCESS::") != -1){
                    var newComment = new Youai.Comment({
                        itemId:YA_GLOBAL.itemId,
                        content:inputField.val(),
                        user: {
                            userId:response.data.result.user.userId, 
                            userNick:response.data.result.user.userNick
                        }
                    });

                    self.addComment(newComment,"reply");
                    self.commentScroll._scrollbarPos(0,0);

                    commentBlock.removeClass("show");
                    inputField.val("");
                }
                
            });

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