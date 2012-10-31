Youai.Router = Backbone.Router.extend({

    routes:{
        '':"index",//首页
        "list/:listCode/p:page":"list",//分页查找列表下的商品列表,接口对应getItemsFromList
        '!detail/:id':'detail', //详情页
        "comments/:id/p:page":"comments"//评论
    },

    index:function(){
        var indexView = new Youai.indexView();
    },

    /*列表页*/
    list:function (listCode,page) {
        //collection

        var goodList = new Youai.GoodList({"listCode":listCode,"pageNo":page});

        var listview = new Youai.goodListView({
            collection:goodList
        });

        goodList.fetch();

        goodList.on('reset', listview.render, listview);

    },

    detail:function (id) {

        console.log(id);


    },

    comments:function(itemId,page){

        var commentList = new Youai.CommentList({"itemId":itemId,"pageNo":page});

        var commentView = new Youai.commentsView({
            collection:commentList
        });

        commentList.fetch();

        //commentList.on('reset', commentView.render, commentView);
        console.log("sss");
        console.log(commentList.toJSON());
        console.log("sss");
    }


});



