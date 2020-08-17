$(function() {
	// 导航切换
	$(".menuson li").click(
			function() {
				$(".menuson li.active").removeClass("active")
				$(this).addClass("active");
				$(parent.frames["topFrame"].document).find(".nav").find("a")
						.removeClass("selected");
			});

	$('.title').click(function() {
		var $ul = $(this).next('ul');
		$('dd').find('ul').slideUp();
		if ($ul.is(':visible')) {
			$(this).next('ul').slideUp();
		} else {
			$(this).next('ul').slideDown();
		}
	});
})
