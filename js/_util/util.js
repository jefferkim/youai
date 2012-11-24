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
         var l;
        if(location.href.indexOf("127.0.0.1") !=-1){
            l = "http://127.0.0.1/gitRep/youai-v3/json/" + url +"?"+ (sid ? "sid=" + sid + "data=" + JSON.stringify(data) : "data=" + JSON.stringify(data));
        }else{
            l = "http://10.13.125.92/gitRep/youai-v3/json/" + url +"?"+ (sid ? "sid=" + sid + "data=" + JSON.stringify(data) : "data=" + JSON.stringify(data));
        }
        return l;

    },

    /* map函数，将传入的controller路径转成请求地址 */
    urlMap:{

        //获取首页的信息
        'getHomeInfo':{
            "method":"getHomeInfo"
        }
    },


     _setCookie:function (name, value,domain) {
            var Days = 365; //保存 30 天
            var exp = new Date();    //new Date("December 31, 9998");
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";domain=" + domain +";expires=" + exp.toGMTString();
    },

    _getCookie:function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;
    },

    //精确到两位小数
    toFixed:function (num,precision) {
        var power = Math.pow(10, precision || 0);
        var n = String(Math.round(num * power) / power);
        var nf = n.split('.')[1];
        var suffixLeng = 0;
        if (nf) {
            suffixLeng = nf.length;
        }
        else if (precision != suffixLeng) {
            n = n + '.';
        }
        for (var i = 0; i < precision - suffixLeng; i++) {
            n = n + '0';
        }
        return n;
    },

    //TODO:判断是否登录了
    _checkLogin:function(response){
        if (response.ret[0].indexOf("CHECKUSER_FAIL::") != -1) {
            var currentUrl = encodeURIComponent(location.href.split("#")[0]),
                host = location.hostname.match(/$|\.(?:m|waptest|wapa)\.taobao\.com/gi);
            location.href = "http://login" + host[0] + "/login.htm?redirectURL=" + currentUrl;
            return false;
        }
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

    init:function(){
        linkfocus("a");
    },


    menu:function(){
        $("#J-menu").on("click",function(e){
            e.preventDefault();
            $(".menu-list").show();
        });

        $('body > div').click(function (ev) {
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toUpperCase() === 'DIV') {
                if ($(target).attr('id') != 'J-menuList') {
                    $("#J-menuList").hide();
                }
            }
        });
        window.addEventListener("hashchange",function(){
            $("#J-menuList").hide();
        },false);
    }


}