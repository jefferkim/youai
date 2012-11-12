/*入口文件13311*/

var Youai = {

    init: function() {

      Youai.router = new Youai.Router();
      Backbone.history.start();


      Youai.Util.init();
      Youai.Util.menu();




    }

};

