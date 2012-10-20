/*
 * util方法
 *
 * */


Youai.Util = {

    //拼装url
    assembleUrl:function (data,sid) {
        var host = location.hostname.match(/$|\.(?:m|waptest|wapa)\.taobao\.com/gi),

            baseUrl = "http://api" + (host[0] === "" ? ".m.taobao.com" : host[0]) +
                      "/rest/api2.do?api=com.taobao.wap.rest2.wo&type=jsonp&callback=?&v=*&source=wo",

            dataPart = sid ? "&sid=" + sid + "&data=" + JSON.stringify(data) : "&data=" + JSON.stringify(data);

        return baseUrl + dataPart;
    },


    /* map函数，将传入的controller路径转成请求地址 */
    urlMap:{
        'queryItemListByUserChannel':{
            "method":"queryItemListByUserChannel",
            "pageSize":"35",
            "pageNo":1,
            "refreshSize":"35",
            "refreshNo":"1"}


    }




}