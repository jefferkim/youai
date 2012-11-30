/*入口文件13311*/

var Youai = {

    init: function() {

      this.testWebpSupport()

      Youai.router = new Youai.Router();
      Backbone.history.start();

      Youai.Util.init();

    },

    testWebpSupport: function() {
      var image = new Image()
      image.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
      image.onload = function()  { Youai.imageFormat = '_.webp' }
      image.onerror = function() { Youai.imageFormat = '' }
    }

};

