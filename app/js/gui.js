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
	$("#productsContainer").click(function(e){
		$("#leftPanel").attr("open", false);
		$("#leftPanel").css('width', '50px');
		$(".categorie").css('width', '50px');
		$(".categorie:active .catContent").css('-webkit-transform', 'scale3d(0.93,0.93,0.93)');
	});
});
	