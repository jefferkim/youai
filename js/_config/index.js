 
//seajs配置中配置的js以seajs为基准

seajs.config({
  alias: {
    'backbone': 'backbone/0.9.2/backbone',
    'underscore': 'underscore/1.3.3/underscore',
   // 'mustache': 'mustache/0.4.0/mustache-debug',
    'mu' : 'mustache/0.4.0/mu',
    'less' : 'less/1.1.5/less',
	  'zepto': 'zepto/1.0.0/zepto',
	  'iscroll' : 'iscroll/4.1.9/iscroll',
	
	  'uriBroker' : './../../../../../base/utils/server/uriBroker',
    'cdn' : './../../../../../base/utils/server/cdn'
  },
  debug: 1
});



  define(function(require){
    require('../router/favRouter').START();
    console.log('index')
  });

/*
	//给module增加全局功能，具体功能为获取数组，数组内容包含为文件名（去后缀名）,以及对应路径

	define(function(require, exports, module) {

  		var Module = module.constructor;

  		Module.prototype.fileattr = function() {
    		var id = this.id;
    		var parts = id.split('/');
    		var fullFileName = parts[parts.length - 1];
    		var filepath = id.split(fullFileName);
    		return [fullFileName.split('.js')[0],filepath[0]];
  		};

	});


*/