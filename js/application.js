/*入口文件13311*/

window.Youai || (Youai = {})

Youai.init = function() {

  Youai.router = new Youai.Router();
  Backbone.history.start();

  Youai.Util.init();


}

