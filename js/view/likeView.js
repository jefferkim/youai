Youai.LikeView = Backbone.View.extend({

  className: 'like-items',

  initialize: function() {
    this.$el.html(JST['template/like_header'](/* need some real data here */))
  },

  render: function() {

  },

  likeDataUrl: function() {
    return 'json/like.json'
  },

  getLikeData: function() {
    var self = this

    $.ajax({
      url: this.likeDataUrl(),
      dataType: 'json',
      success: function(json) {
        if (json.ret[0].search('SUCCESS') > -1) {
          self.data = json.data.result.data;
          console.log(self.data)
          self.render()
        } else {
          console.log('mtop error')
        }
      },
      error: function() {
        console.log('network error')
      }
    })

  }

})