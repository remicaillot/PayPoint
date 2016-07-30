var manifest = require("./package.json");
if (!manifest.devtools) {
    if (localStorage.isMaximized == true) {
        win.maximize();
        jQuery(".maximize").css('background-image', 'url(assets/images/maximize.svg)');
    } else if (localStorage.isMaximized == "false") {
        win.unmaximize();
        jQuery(".maximize").css('background-image', 'url(assets/images/unmaximize.svg)');
    } else {
        localStorage.isMaximized = false
        win.unmaximize();
    }
}
(function($) {
    $(document).ready(function() {
        if (!manifest.devtools) {
            $(".devTools").remove();
        }
        if (localStorage.isMaximized == undefined) {
            localStorage.isMaximized = false;
            win.unmaximize()
        }
        win.on('maximize', function() {
            localStorage.isMaximized = true;
            $(".maximize").css('background-image', 'url(assets/images/unmaximize.svg)');
        });
        win.on('unmaximize', function() {
            localStorage.isMaximized = false;
            $(".maximize").css('background-image', 'url(assets/images/maximize.svg)');
        });
        $(".maximize").click(function() {
            if (localStorage.isMaximized == true) {
                win.unmaximize();
                $(".maximize").css('background-image', 'url(assets/images/maximize.svg)');
            } else {
                win.maximize();
                $(".maximize").css('background-image', 'url(assets/images/unmaximize.svg)');
            }
        });
        $(".minimize").click(function() {
            win.minimize();
        });
        $(".close").click(function() {
            win.close(true);
        });
        $(".dev").click(function() {
            win.showDevTools();
        });
        $(".reload").click(function() {
            win.reloadIgnoringCache();
        });
    });
})(jQuery);