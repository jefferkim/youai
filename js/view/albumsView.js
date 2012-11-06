/*
* 专辑列表
*
* */
Youai.albumsView = Backbone.View.extend({

    el:"#content",

    tpl:{
        "albumsLayout":JST["template/album_layout"]
    },

    events:{


    },

    initialize:function () {


       this.$el.html(this.tpl["albumsLayout"]());



    },




    addItem:function (album) {

        var albumView = new Youai.albumItemView({model:album});

        $("#J-ablums").append(albumView.render());
    },


    render:function () {
        var self = this;

        this.collection.each(function (album) {
            self.addItem(album);
        });

    }

});