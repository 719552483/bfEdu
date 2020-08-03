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
	changeMenu();
})

//根据权限渲染菜单	 
function changeMenu(){
	var js=JSON.parse($.session.get('authoritysInfo')).js;
	if(js!=="sys"){
		var cdqx = JSON.parse($.session.get('authoritysInfo')).cdqx.split(",");
		var currentMenus = $(parent.frames["leftFrame"].document).find(".menuson").find("a"); //frame获取父窗口中的menu
		for (var c = 0; c< currentMenus.length; ++c) {
			if(cdqx.indexOf(currentMenus[c].id)===-1){
				$(parent.frames["leftFrame"].document).find("#"+currentMenus[c].id).closest('li').remove();
			}
		}
		
		
		var removeArray=new Array();
		var menusParents = $(parent.frames["leftFrame"].document).find(".menuson"); //frame获取父窗口中的menu
		for (var m = 0; m< menusParents.length; ++m) {
			if(menusParents[m].children.length===0){
				removeArray.push(menusParents[m].parentNode.className);
			}
		}
		for (var m = 0; m< removeArray.length; ++m) {
			$("."+removeArray[m]).remove();
		}
	}

}