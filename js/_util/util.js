/*
 * util方法
 *
 * */


Youai.Util = {

    //拼装url
    parseUrl:function (url,sid) {

        var data;
        if(typeof(url) == "string"){
            data = this.urlMap[url];
        }else{
            data = url;
        }

        var host = location.hostname.match(/$|\.(?:m|waptest|wapa)\.taobao\.com/gi),

            baseUrl = "http://api" + (host[0] === "" ? ".waptest.taobao.com" : host[0]) +
                      "/rest/api2.do?api=com.taobao.wap.rest2.wo3&type=jsonp&callback=?&v=*&source=wo",

            dataPart = sid ? "&sid=" + sid + "&data=" + JSON.stringify(data) : "&data=" + JSON.stringify(data);

        return baseUrl + dataPart;
    },


    /* map函数，将传入的controller路径转成请求地址 */
    urlMap:{

        'getItemsFromList':{
            "method":"getItemsFromList",
            "listCode":"7233559832",
            "pageSize":"10",
            "pageNo":"1"
        },

        //获取首页的信息
        'getHomeInfo':{
            "method":"getHomeInfo"
        }


    },


    urlGenreget:function(urlflag,data){
        var url = this.urlMap[urlflag];
        _.filter_(data, function (num, key) {
            return url[key];
        });


    },

    dataParser:function(){



    }

}