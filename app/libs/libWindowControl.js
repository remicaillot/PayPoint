var gui = require('nw.gui'),
    win = gui.Window.get(),
    manifest = require("./package.json");
gui.App.setCrashDumpDir("./");
if (localStorage.getItem("isMaximized") == "true") {
    win.maximize();
    jQuery(".maximize").css('background-image', 'url(assets/images/maximize.svg)');
} else if (localStorage.getItem("isMaximized") == "false") {
    win.unmaximize();
    jQuery(".maximize").css('background-image', 'url(assets/images/unmaximize.svg)');
} else {
    localStorage.setItem("isMaximized", false)
    win.unmaximize();
}
(function($) {
    $(document).ready(function() {
        if (!manifest.devtools) {
            $(".devTools").remove();
        }
        if (localStorage.getItem("isMaximized") == undefined) {
            localStorage.setItem("isMaximized", false);
            win.unmaximize()
        }
        win.on('maximize', function() {
            localStorage.setItem("isMaximized", true);
            $(".maximize").css('background-image', 'url(assets/images/unmaximize.svg)');
        });
        win.on('unmaximize', function() {
            localStorage.setItem("isMaximized", false);
            $(".maximize").css('background-image', 'url(assets/images/maximize.svg)');
        });
        $(".maximize").click(function() {
            if (localStorage.getItem("isMaximized") == "true") {
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
            win.reloadDev()
        });
    });
})(jQuery);