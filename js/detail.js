//= require vendor/zepto
//= require _component/swipe

$(function() {

  window.vslide = new Swipe($('.vslide')[0], { vertical: true, preload: 4 });

  vslide.load();

})