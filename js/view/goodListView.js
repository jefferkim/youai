Youai.goodListView = Backbone.View.extend({

    el:"#J-List",


    template:['{{#lists}}',
        '<li style="height:{{height}}px;"><a href="#!detail/{{itemId}}"><img src="{{imageSmallUrl}}" alt="""/></a></li>',
        '{{/lists}}'
    ].join(""),

    events:{
      ".J-zoom":"zoomPic"
    },

    initialize:function () {


    },

    /*图片放大*/
    zoomPic:function(){


    },

    renderItem:function ($model) {

        /*var itemview = new ItemView({
         model: $model
         });
         $(this.el).append( itemview.render().el );*/

    },


    render:function () {

        var tpl = this.template;
        var collections = this.options.Collection.toJSON();

        new Youai.Waterfall("#J-List", {
            load:function (success) {
                var items = [],
                    heights = [];
                $.each(collections, function (index, item) {
                    items.push(Mustache.to_html(tpl, {"lists":item}));
                    heights.push(item.height);
                });

                success(items, heights);
            }
        });


       //return this;

    }



});