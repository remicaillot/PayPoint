var manifest = require("./package.json");


(function($) {
    $(document).ready(function() {
        if (!manifest.devtools) {
            $(".devTools").remove();
        }
        try{
            win.maximize();
            jQuery(".maximize").css('background-image', 'url(assets/images/maximize.svg)');
        } catch(e){
            console.log(e);
        }
        win.on('maximize', function() {
            $(".maximize").css('background-image', 'url(assets/images/unmaximize.svg)');
        });
        win.on('unmaximize', function() {
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