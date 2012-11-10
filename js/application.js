/*入口文件13311*/

var Youai = {

    init: function() {

      Youai.router = new Youai.Router();
      Backbone.history.start();

      $("#J-menu").on("click",function(e){
          e.preventDefault();
          $(".menu-list").show();
      });




    }

};

