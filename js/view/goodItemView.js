/*
 * 宝贝列表页
 * 传入model
 *
 * */

Youai.goodItemView = Backbone.View.extend({

    tagName:"li",
    //el:"#content",

    templates:{
        "list-goodItem":JST["template/list_goodItem"]
    },

    events:{
        "click .J-zoom":"zoomPic"
    },

    initialize:function () {

       // this.model.on("change",this.render,this);

    },


    /*图片放大*/
    zoomPic:function (e) {
        e.preventDefault();
        Youai.sliderShow.init('slider',this.model);
    },


    render:function () {
        console.log(this.model.getItemInfo());

        return this.$el.html(this.templates["list-goodItem"](this.model.getItemInfo()));

    }



});