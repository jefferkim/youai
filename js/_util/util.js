/*
 * util方法
 *
 * */


Youai.Util = {

    //拼装url
    parseUrl:function (url,sid) {

        var data = ("string" == typeof url) ? this.urlMap[url] : url;

        var host = location.hostname.match(/$|\.(?:m|waptest|wapa)\.taobao\.com/gi),

            baseUrl = "http://api" + (host[0] === "" ? ".waptest.taobao.com" : host[0]) +
                      "/rest/api2.do?api=com.taobao.wap.rest2.wo3&type=jsonp&callback=?&v=*&source=wo",

            dataPart = sid ? "&sid=" + sid + "&data=" + JSON.stringify(data) : "&data=" + JSON.stringify(data);

        return baseUrl + dataPart;
    },

    /*dev环境下的url方式*/
    _devParseUrl:function(url,data,sid){

        return "http://127.0.0.1/gitRep/youai-v3/json/" + url +"?"+ (sid ? "sid=" + sid + "data=" + JSON.stringify(data) : "data=" + JSON.stringify(data));
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

    //TODO:判断是否登录了
    _checkLogin:function(data){
        return true;
    },

    Ajax:function (url, callback) {
        var self = this;
        $.ajax({
            url:url,
            error:function () {
                //tips();
            },
            success:function (data) {
                if(!self._checkLogin(data)){
                    return false;
                }
                callback && callback(data);
            }
        });
    },

    dataParser:function(){



    }

}