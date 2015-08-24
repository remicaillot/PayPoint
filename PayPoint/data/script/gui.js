var gui = require('nw.gui'),
    fs = require('fs'),
    win = gui.Window.get(),
    toCsv = require("to-csv");
gui.App.setCrashDumpDir("./");
if (localStorage.getItem("isMaximized") == "true") {
    win.maximize();
    jQuery(".maximize").css('background-image', 'url(data/images/maximize.svg)');
} else if (localStorage.getItem("isMaximized") == "false") {
    win.unmaximize();
    jQuery(".maximize").css('background-image', 'url(data/images/unmaximize.svg)');
} else {
    localStorage.setItem("isMaximized", false)
    win.unmaximize();
}
(function($) {
    $(document).ready(function() {
        $("html").css('background', 'rgba(0,0,0,0)', function() {
            win.setTransparent(!win.isTransparent);
        });
        if (localStorage.getItem("isMaximized") == undefined) {
            localStorage.setItem("isMaximized", false);
            win.unmaximize()
        }
    });
    $(".maximize").click(function() {
        if (localStorage.getItem("isMaximized") == "true") {
            win.unmaximize();
            $(".maximize").css('background-image', 'url(data/images/maximize.svg)');
        } else {
            win.maximize();
            $(".maximize").css('background-image', 'url(data/images/unmaximize.svg)');
        }
    });
    win.on('maximize', function() {
        localStorage.setItem("isMaximized", true);
        $(".maximize").css('background-image', 'url(data/images/unmaximize.svg)');
    });
    win.on('unmaximize', function() {
        localStorage.setItem("isMaximized", false);
        $(".maximize").css('background-image', 'url(data/images/maximize.svg)');
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
        win.reload();
    });
    $("#menuGeneralButton").click(function(event) {
        event.preventDefault();
        if ($("#menuGeneralButton").attr("openMenu") == "false") {
            $("#menuGeneral").css('left', "0");
            $("#menuGeneralButton").css('background', "rgba(0, 0, 0, 0.2) url(data/images/back.svg) no-repeat center");
            $("#menuGeneralButton").css('backgroundSize', "35px 35px");
            $("#menuGeneralButton").attr('openMenu', "true");
        } else {
            $("#menuGeneral").css('left', "-305px");
            $("#menuGeneralButton").css('background', "rgba(0, 0, 0, 0.2) url(data/images/menu.svg) no-repeat center");
            $("#menuGeneralButton").css('backgroundSize', "35px 35px");
            $("#menuGeneralButton").attr('openMenu', "false");
        }
    });
    $("#menuGeneralButton").mouseenter(function(event) {
        event.preventDefault();
        $("#menuGeneralButton").css('backgroundColor', 'rgba(0, 0, 0, 0.2)');
    });
    $("#menuGeneralButton").mouseleave(function(event) {
        event.preventDefault();
        $("#menuGeneralButton").css('backgroundColor', 'rgba(0, 0, 0, 0)');
    });
    $("a[targetType='ancre']").click(function(event) {
        event.preventDefault();
        var page = ["products", "manualAmount", "package"];
        var target = $(this).attr("target");
        $(".nav_productList a .navitem").attr("class", "navitem");
        $(".nav_productList a[target='" + target + "'] .navitem").attr("class", "navitem selected");
        for (var i = 0; i < 3; i++) {
            $("#productList_wrapper .tab." + page[i]).fadeOut("fast", function() {
                if (i == 3) {
                    $("#productList_wrapper ." + page[target]).fadeIn("fast");
                }
            });
        }
    });
    $("#productList_wrapper .item").click(function(event) {
        event.preventDefault();
    });
})(jQuery);