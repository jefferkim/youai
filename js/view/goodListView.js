Youai.goodListView = Backbone.View.extend({

    el:"#content",

    templates:{
        "list-goodLayout":tpl("template/list_good"),
        "list-goodItem":tpl("template/list_goodItem")
    },

    events:{
        "click .J-zoom":"zoomPic"
    },

    initialize:function () {


    },

    /*图片放大*/
    zoomPic:function (e) {
        e.preventDefault();




    },


    render:function () {

        $(this.el).html(this.templates["list-goodLayout"]);

        var goodItemtpl = this.templates["list-goodItem"];
        var collections = this.options.Collection.toJSON();

        new Youai.Waterfall("#J-waterfall", {
            colWidth:150,
            load:function (success) {
                var items = [],
                    heights = [];
                $.each(collections, function (index, item) {
                    items.push(_.template(goodItemtpl, {"img":item.images[0].url, "originalPrice":item.originalPrice, "comment":item.comments}));
                    heights.push(parseInt(item.images[0].height) + 34);
                });

                success(items, heights);
            }
        });


    }



});