/*
 * util方法
 *
 * */


Youai.Util = {

    
    //拼装url
    parseUrl:function (url) {

        var data = ("string" == typeof url) ? this.urlMap[url] : url;

        var host = location.hostname.match(/$|\.(?:m|waptest|wapa)\.taobao\.com/gi),

            baseUrl = "http://api" + (host[0] === "" ? ".waptest.taobao.com" : host[0]) +
                      "/rest/api2.do?api=com.taobao.wap.rest2.wo3&type=jsonp&callback=?&v=*&source=wo",

            dataPart = "&sid=" + location.search.split("?sid=")[1] + "&data=" + JSON.stringify(data);

        return baseUrl + dataPart;
    },

    /*dev环境下的url方式*/
    _devParseUrl:function(url,data){
         var l;
        if(location.href.indexOf("127.0.0.1") !=-1){
            l = "http://127.0.0.1/gitRep/youai-v3/json/" + url +"?"+ "sid=" + location.search.split("?sid=")[1] + "data=" + JSON.stringify(data);
        }else{
            l = "http://10.13.125.92/gitRep/youai-v3/json/" + url +"?"+ "sid=" + location.search.split("?sid=")[1] + "data=" + JSON.stringify(data);
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



    setCookie:function (name, value,domain) {
            var Days = 365; //保存 30 天
            var exp = new Date();    //new Date("December 31, 9998");
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";domain=" + domain +";expires=" + exp.toGMTString();
    },

    getCookie:function (name) {
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
            if(location.href.indexOf("localhost") != -1){
               host[0] = ".waptest.taobao.com";
            }
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
        
        this.menu();

        linkfocus("a");  
    },

    cutstr:function (str, len) {
        var str_length = 0;
        var str_len = 0;
        str_cut = new String();
        str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            a = str.charAt(i);
            str_length++;
            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
            return  str;
        }
    },

    _isPreview:function(){
        var args;
        if(location.search.indexOf("isPreview") !=-1 ){
            args = this.GetUrlParms();
        }
        return args;
    },
    //获取url参数
    GetUrlParms:function () {
        var args = {};
        var query = location.search.substring(1);//获取查询串
        var pairs = query.split("&");//在逗号处断开
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');//查找name=value
            if (pos == -1)   continue;//如果没有找到就跳过
            var argname = pairs[i].substring(0, pos);//提取name
            var value = pairs[i].substring(pos + 1);//提取value
            args[argname] = unescape(value);//存为属性
        }
        return args;
    },

    menu:function(){
        var menuList = $("#J-menuList");

        $("#J-menu").on("click",function(e){
            e.preventDefault();
            $(".menu-list").toggleClass("show");
        });

        $('body > div').click(function (ev) {
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toUpperCase() === 'DIV') {                
                if ($(target).attr('id') != 'J-menuList') {
                    menuList.removeClass("show");
                }
            }
        });
        $("a","#J-menuList").click(function(e){
            e.preventDefault();
            var target = e.currentTarget,
                goToHash = $(target).attr("href");
            menuList.removeClass("show");

            var pds = $(target).attr("data-pds");

            var host = location.hostname.match(/$|\.(?:m|waptest|wapa)\.taobao\.com/gi);
            //不关心返回
            $.ajax({
                url:'http://wo.'+host[0]+'/operation.htm',
                data:{pds:pds},
                success:function(response){
                    console.log(response)
                }
            });
            Youai.router.navigate(goToHash,true);
        });
    }


}