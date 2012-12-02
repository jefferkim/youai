Youai.albumList = Backbone.Collection.extend({

    initialize:function () {
        this.albumsL();
    },

    model:Youai.Album,

    albumsL:function(){
        console.log(this.length);
    }

});