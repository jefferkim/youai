Youai.LikeView = Backbone.View.extend({

  className: 'like-items',

  initialize: function() {
    this.$el.html(JST['template/like_header'](/* need some real data here */))
  },

  render: function() {
    var self = this;
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].records && this.data[i].records.length) {
        this.$el.append(JST['template/like_section'](this.data[i]))

        new Youai.Waterfall(this.$('.good-list').last(), {
          colWidth: 153,
          load: function(success) {
            var items = [], heights = [], records = self.data[i].records
            for (var j = 0; j < records.length; j++) {
              items.push(JST['template/like_item'](records[j]))
              heights.push(parseInt(records[j].images[0].height) + 34)
            }
            console.log(heights)
            success(items, heights);
          }
        })
      }
    }

    $('.separator').last().remove()

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