jQuery(document).ready(function($) {
	$("#sideBarMenu").click(function(e){
		if($("#leftPanel").attr("open") == "open"){
			$("#leftPanel").attr("open", false);
			$("#leftPanel").css('width', '50px');
			$(".categorie").css('width', '50px');

			$(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.93,0.93,0.93)');
		}else{
			$("#leftPanel").attr("open", true);
			$(".categorie").css('width', '200px');
			$("#leftPanel").css('width', '200px');
			$(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.89,0.89,0.89)');
		}
		
	});
	$(".categorie").click(function(event) {
		if($(this).attr('id') != "sideBarMenu"){
			$(".categorie").removeClass('activated');
			$(this).addClass('activated');
			$("#leftPanel").attr("open", false);
			$("#leftPanel").css('width', '50px');
			$(".categorie").css('width', '50px');
			$(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.93,0.93,0.93)');
		}		
	});

	
	$('html').click(function() {
		$("#keyboard").css('bottom', '-350px');
		$("#leftPanel").attr("open", false);
		$("#leftPanel").css('width', '50px');
		$(".categorie").css('width', '50px');
		$(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.93,0.93,0.93)');
		
		currentFocusedInput.removeClass('focused');
	});
	$("input[type='text']").click(function(event){
	    event.stopPropagation();
	});
	$("#leftPanel").click(function(event){
	    event.stopPropagation();
	});
	$("#keyboard").click(function(event){
	    event.stopPropagation();
		currentFocusedInput.addClass('focused');
	});
});
	