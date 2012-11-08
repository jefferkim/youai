/*
* 不考虑横屏等涉及resize的问题
* h5暂时没有横屏
* */
Waterfall = function (container, options) {
    var setting = {
        colCount:2,
        colWidth:150, //定义每列宽度
        load:function () {
        }
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

    adjustItem:function (itemRaw, height) {
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
        var margin = Math.max(self.containerWidth - curColCount * setting.colWidth, 0) / (curColCount - 1);

        item.css({
            left:dest == 0 ? 0 : dest * setting.colWidth + dest * margin,
            top:guard
        });


        $(self.container).append(item);

        self.curColHeights[dest] += parseInt(height) + 10; //图片垂直间距为10px
        return item;
    },

    /*提高灵活性，将item渲染放在load配置中，items将会是元素渲染后html片段的数组*/
    addItems:function (items, heights) {
        for (var i = 0; i < items.length; i++) {
            this.adjustItem(items[i], heights[i]);
        }
        //获得最高的高度，赋值给container
        $(this.container).height(Math.max.apply(Math, this.curColHeights));
    },

    loadData:function () {
        var self = this;
        var load = self.setting.load;
        load && load(success);
        function success(items, heights) {
            self.addItems(items, heights);
        }
    },

    destroy:function () {
        $(window).unbind("scroll");
    }
}

Youai.Waterfall = Waterfall;

