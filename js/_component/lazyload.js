/*
 *宝贝列表翻页
 *
 *  caochun edit by 20120724,修复safari下,前进回退键到当前页面onscroll事件失效
 */

window.lazyload = {
    init:function (opt) {
        var that = this;
        that.img.init();
    },
    img:{
        trigger:function () {
            var that = this,
                src = that.op,
            isPhone = that.isPhone,
                eventType = isPhone && 'touchend' || 'scroll';
            if (that['prevlist']) {
                that['prevlist'].each(function (n, node) {
                    node && (node.onerror = node.onload = null);
                });
            }
            //console.log(that['prevlist']);
            that['imglist'] = $('img.lazy');
            that['prevlist'] = $(that['imglist'].concat());
            $(window).trigger(eventType);
        },
        init:function () {
            var that = this,
                minDist = 5,
                minTime = 200, //单位ms
                systemVer = navigator.appVersion.match(/(iPhone\sOS)\s([\d_]+)/),
                isPhone = systemVer && true || false,
                version = isPhone && systemVer[2].split('_');
            version = version && parseFloat(version.length > 1 ? version.splice(0, 2).join('.') : version[0], 10);
            isPhone = that.isPhone = isPhone && version < 6;
            if (isPhone) {  //针对ios6以内的版本,后退键回到页面不触发onscroll时，直接使用touch事件替代
                var touchLazy,
                    timerPhone;
                $(window).on('touchstart',function (ev) {
                    //var et = ev.changedTouches[0];
                    touchLazy = {
                        //sx : et.clientX,
                        sy:window.scrollY,
                        time:Date.now()
                    };
                    //$('#test')[0].innerHTML += 'starty:'+window.scrollY+'<br>';
                    timerPhone && clearTimeout(timerPhone);
                }).on('touchend',function (ev) {
                        if (ev && ev.changedTouches) {
                            var disty = Math.abs(window.scrollY - touchLazy.sy);
                            //distx = Math.abs(et.clientX - touchLazy.sx),
                            //$('#test')[0].innerHTML += 'endy:'+window.scrollY+'<br>';
                            if (disty > minDist) {/* && disty > distx*/
                                var timedist = Date.now() - touchLazy.time;
                                timerPhone = setTimeout(function () {
                                    that.changeimg();
                                    touchLazy = {};
                                    clearTimeout(timerPhone);
                                    timerPhone = null;
                                }, timedist > minTime ? 0 : 200);
                            }
                        }
                        else {
                            that.changeimg();
                        }
                    }).on('touchcancel', function () {
                        timerPhone && clearTimeout(timerPhone);
                        touchLazy = {};
                    });
            }
            else {
                $(window).on('scroll', function () {
                    that.changeimg();

                });
            }
            that.trigger();
        },

        _inViewport:function(el,threshold){
              var top = window.pageYOffset,
                    btm = window.pageYOffset + window.innerHeight,
                    elTop = el.offset().top;
                return elTop >= top && elTop + (threshold || -100) <= btm;
        },

        
        changeimg:function () {
            var that = this;
           
            function act(_self, n) {
                var original = _self.attr('dataimg');
                _self.attr('src', original);

                if (!_self[0].onload) {
                    _self[0].onload = function () {
                        $(this).removeClass('lazy').removeAttr('dataimg');
                        that['imglist'][n] = null;
                        this.onerror = this.onload = null;
                    }
                    _self[0].onerror = function () {
                        this.src = 'http://a.tbcdn.cn/mw/s/common/icons/nopic/no-90.png';
                        $(this).removeClass('lazy').removeAttr('dataimg');
                        that['imglist'][n] = null;
                        this.onerror = this.onload = null;
                    }
                }
            }



            var hasCommentItem = $('img.hascomment');
            if(hasCommentItem.length >0 && that._inViewport(hasCommentItem,20)){
                $(document.body).trigger("list:popcomment",[hasCommentItem]);
            }

            that['imglist'].each(function (index, node) {
                if (!node) return;
                var $this = $(node);
                if (!that._inViewport($this)) return
                act($this, index);

            });
        }
    }
};
