Youai.Router = Backbone.Router.extend({

    routes:{
        '':"index",//首页
        "list/:listCode":"list",//分页查找列表下的商品列表,接口对应getItemsFromList
        '!detail/:id':'detail' //详情页
    },

    index:function(){
        var indexView = new Youai.indexView();
    },

    /*列表页*/
    list:function () {
        //collection
        var goodList = new Youai.GoodList();

        var listview = new Youai.goodListView({
            collection:goodList
        });

        goodList.fetch();

        goodList.on('reset', listview.render, listview);

    },

    detail:function (id) {

        console.log(id);


    }

});



