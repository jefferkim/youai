var appVersion = navigator.appVersion,
    webkitTest = (/webkit/gi),
    androidTest = (/android/gi)
    ;

function addEvent(el) {
    el.addEventListener('touchend', ontouchend, false);
    el.addEventListener('touchmove', ontouchmove, false);
}

function removeEvent(el) {
    el.removeEventListener('touchend', ontouchend, false);
    el.removeEventListener('touchmove', ontouchmove, false);
}

function ontouchstart(e) {
    var el = this;
    addEvent(el);
}

function ontouchmove(e) {
    var el = this;
    removeEvent(el)
}

function ontouchend(e) {
    var el = this;

    el.className += ' c-linkfocus-active';

    setTimeout(function () {
        var className = el.className;
        el.className = className.replace(' c-linkfocus-active', '');
        removeEvent(el);
    }, 200);
}

function linkfocus(selector) {
    if (webkitTest.test(appVersion) && androidTest.test(appVersion)) {
        var ss = document.styleSheets[0];
        ss.addRule('*', '-webkit-tap-highlight-color:rgba(0,0,0,0);');

        if (selector !== false) {
            ss.addRule('.c-linkfocus', '-webkit-mask:none;');
            ss.addRule('.c-linkfocus-move', '-webkit-mask:none;');
            ss.addRule('.c-linkfocus-active', [
                'background:transparent!important;',
                'background-color:transparent!important;',
                '-webkit-mask-clip: content-box;',
                '-webkit-mask-origin: content;',
                '-webkit-mask-repeat: no-repeat;',
                '-webkit-border-radius: 3px;',
                '-webkit-mask-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(0,0,0,0.3)), to(rgba(0,0,0,0.3)));'
            ].join(''));

            //$(selector).addClass('c-linkfocus-active');

            if (typeof selector == 'string') {
                $(document).on('touchstart', selector || '*[class~="c-linkfocus"]', ontouchstart);
            } else if (typeof selector == 'object') {
                $(selector).on('touchstart', ontouchstart);
            }
        }
    }
}