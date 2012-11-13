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

    initialize:function (options) {

        this.options = options;
        this.$el.html(this.tpl["albumsLayout"]({"type":options.albumType}));

        var method = (options.albumType === "recommend" ? "getRecommendAlbums.json" : "getLikeAlbums.json");
        this.albumList = new Youai.albumList();
        this.albumList.url =  Youai.Util._devParseUrl(method, {"pageSize":"10", "pageNo":options.pageNo});

        this.albumList.fetch();
        this.albumList.on('reset', this.render, this);

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