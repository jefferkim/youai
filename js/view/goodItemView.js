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
        var host = location.hostname.match(/$|\.(?:m|waptest|wapa)\.taobao\.com/gi);
        $.ajax({
            url:'http://wo'+host[0]+'/operation.htm',
            data:{pds:"list_gotolargepic#h#youai"},
            success:function(){
            }
        });
        Youai.sliderShow.init('slider',this.model);
    },


    render:function () {
        var goodItemInfo = this.model.getItemInfo();
        Youai.DATA_ITEMID_INDEX.push(goodItemInfo.itemId);
        return this.$el.html(this.templates["list-goodItem"](goodItemInfo));

    }



});