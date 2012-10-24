   Waterfall = function (container,options) {
        var setting = {
            colCount:2,
            colWidth:150,//定义每列宽度
            load:function(){}
        };

        $.extend(setting, options || {});


       var container = $(container), //容器
           containerWidth = container.width(), //容器宽度
           colHeight = container.offset().top;	//容器距顶部的高度

       var nextpage = 0, //记录加载的页数
           loading = 0, //标志是否正在加载
           adjusting = 0, //标志是否正在调整
           curColHeights = []; //记录当前每列的高度

        curColHeights.length = Math.max(parseInt(containerWidth / setting.colWidth), setting.colCount);
       //每列高度初始化为0
        for (var i = 0; i < curColHeights.length; i++) {
           curColHeights[i] = 0;
        }


        this.container = container;
        this.curColHeights = curColHeights;
        this.containerWidth = containerWidth;
        this.setting = setting;

        this.loadData();

    };



    Waterfall.prototype = {

        adjustItem:function(itemRaw, height){
            var self = this,
                setting = self.setting,
                item = $(itemRaw),
                curColCount = self.curColHeights.length, //列数
                dest = 0, //记录高度最小的列
                guard = Number.MAX_VALUE; //记录高度最小的列高
            //找到高度最小的一列
            for (var i = 0; i < curColCount; i++) {
                if (self.curColHeights[i] < guard) {
                    guard = self.curColHeights[i];
                    dest = i;
                }
            }
            if (!curColCount) {
                guard = 0;
            }
            // 计算图片间隔
            var margin = Math.max(self.containerWidth - curColCount * setting.colWidth, 0) / (curColCount + 1);
            console.log(margin);
            item.css({
                left:dest * setting.colWidth + (dest + 1) * margin,
                top:guard
            });


            $(self.container).append(item);


            self.curColHeights[dest] += parseInt(height) + 10; //图片垂直间距为10px
            return item;
        },

        /*提高灵活性，将item渲染放在load配置中，items将会是元素渲染后html片段的数组*/
        addItems:function(items,heights){
            for(var i=0;i<items.length;i++){
                this.adjustItem(items[i],heights[i]);
            }

        },

        loadData:function(){
           var self = this;
           var load = self.setting.load;
           load && load(success);
           function success(items,heights){
              self.addItems(items,heights);
           }
        },

        /*resize时调整，为了性能考虑可以去掉*//*
        doResize:function () {
            var self = this;
            //没有变化则不需要调整
            if (self.container.width() === self.containerWidth) {
                return;
            }
            var items = self.container.find(".waterfall");
           *//* 正在加，直接开始这次调整，剩余的加和正在调整的一起处理
           正在调整中，取消上次调整，开始这次调整 *//*

            if (self.adjusting) {
                adjuster.stop(items, adjusting);
            }
            // 重新计算容器宽度等信息
            self.recalculate(items);
            // 开始调整
            adjuster.start(items);
        },

        recalculate:function (items) {
            containerWidth = container.width();
            curColHeights = [];
            curColHeights.length = Math.max(parseInt(containerWidth / colWidth), colCount); //计算列数
            //每列高度初始化为0
            $.each(curColHeights, function (i) {
                curColHeights[i] = 0;
            });
            items = container.find(".waterfall");
        },*/



        destroy:function(){
            $(window).unbind("scroll");
        }



        /*


    function doScroll() {
        console.log("start scroll!");
        //如果还未加载完成，则不要再次加载
        if (loading) {
            return;
        }
        // 如果正在调整中，则不要再次加载
        if (adjusting) {
            return;
        }

        var colHeight = 0;
        if (curColHeights.length) {
            colHeight += Math.min.apply(Math, curColHeights);
        }
        // 最小高度低于预加载线，则开始加载
        console.log("window.scrollY: " + window.scrollY);
        console.log("window.innerHeight: " + window.innerHeight);
        console.log("height1: " + (window.scrollY + window.innerHeight));
        console.log("height2: " + (colHeight + container.offset().top));
        //if ((parseInt($(window).scrollTop()) + parseInt($(window).height())) >= (colHeight+container.offset().top)) {
        var s = Math.max(window.scrollY, $(window).scrollTop());
        var h = Math.max(window.innerHeight, $(window).height());
        if ((s + h) >= (colHeight + container.offset().top)) {
            console.log("scroll!");
            $('.loading').show();
            loading = 1;
            load();
        }
    }




    //定义调整器
    var adjuster = {
        start:function (items) {
            var index = 0;
            if (items.length > 0) {
                adjusting = setTimeout(function () {
                    adjustItem(items[index], $(items[index]).height());
                    index++;
                    if (index < items.length) {
                        adjusting = setTimeout(arguments.callee, 25);
                    } else {
                        adjusting = 0;
                        container.height(Math.max.apply(Math, curColHeights));
                    }
                }, 25);
            }
        },
        stop:function (items, adjusting) {
            if (adjusting) {
                clearTimeout(adjusting);
                items = {};
            }
        }
    }

    //初始化加载
    loading = 1;
    load();



    //屏幕滚动时加载图片
    var onScroll = function () {
        setTimeout(doScroll, 50);
    };
    $(window).bind("scroll", onScroll);
    //屏幕旋转时调整图片
    var onResize = function () {
        setTimeout(doResize, 50);
    };
    $(window).bind("resize", onResize); //PC浏览器的resize
    var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
    $(window).bind(orientationEvent, function () {
        switch (window.orientation) {
            case 0:
            case 180:
            case 90:
                onResize();
                break;
            case -90:
                onResize();
                break;
        }
    });


*/
    }

   Youai.Waterfall = Waterfall;

