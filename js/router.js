Youai.Router = Backbone.Router.extend({

    routes:{
        '':'goods', //空值
        '!detail/:id':'detail' //详情页
    },

    /*列表页*/
    goods:function () {
        //collection
        var goodList = new Youai.GoodList();

        var listview = new Youai.goodListView({
            Collection:goodList
        });

        goodList.fetch();

        goodList.on('reset', listview.render, listview);

    },

    detail:function (id) {

        console.log(id);


    }

});



