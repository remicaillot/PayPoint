 var gui = require('nw.gui'),
     fs = require('fs'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)
 // Get the current window
 var win = gui.Window.get();
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
             $("#menuGeneralButton").css('backgroundSize', "30px 30px");
             $("#menuGeneralButton").attr('openMenu', "true");
         } else{
            $("#menuGeneral").css('left', "-305px");
             $("#menuGeneralButton").css('background', "rgba(0, 0, 0, 0.2) url(data/images/menu.svg) no-repeat center");
             $("#menuGeneralButton").css('backgroundSize', "30px 30px");
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
 })(jQuery);