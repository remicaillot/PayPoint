var previousScreen = [];
$(document).ready(function(){
    $("div[targetScreen]").click(function(e){
        var $this = $(this);
        previousScreen.push($this.attr("targetScreen"));
        ScreenManager.resetScreen(function () {
            console.log("Screen", $this.attr("targetScreen"));
            $($(".screen[screenId='" + $this.attr("targetScreen") + "']")[0]).css("display", "block");
            $(".screenPane").css("marginLeft", "-100%");

        });
    });
    $(".screenContentBox .backButton").click(function (e) {
        previousScreen.pop();
        if(previousScreen.length == 0){
            ScreenManager.resetScreen();
        }else{
            ScreenManager.resetScreen(function () {
                $($(".screen[screenId='" + previousScreen[previousScreen.length - 1] + "']")[0]).css("display", "block");
                $(".screenPane").css("marginLeft", "-100%");
            });
        }

    });
});
class ScreenManager{
    static resetScreen(cb){
        $(".screen[screenId]").css("display", "none");
        $(".screen#main").css("display", "block");
        $(".screenPane").css("marginLeft", "0");
        if(typeof cb === "function"){
            cb();
        }
    }
}