Youai.albumsView = Backbone.View.extend({

    el:"#content",

    tpl:{
        "albumsLayout":JST["template/album_layout"]
    },

    events:{

    },

    initialize:function (options) {
        this.albumList = options.data;
    },

    addItem:function (album) {
        var albumItemView = new Youai.albumItemView({model:album});
        $("#J-ablums").append(albumItemView.render());
    },

    render:function () {
        var self = this;
        this.albumList.each(function (album) {
            self.addItem(album);
        });
    }
});