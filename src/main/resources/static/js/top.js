$(function() {
	//顶部导航切换
	$(".nav li a").click(function() {
		$(".nav li a.selected").removeClass("selected")
		$(this).addClass("selected");
		$(parent.frames["leftFrame"].document).find(".leftmenu").find("li").removeClass("active");
	})
	var week=JSON.parse($.session.get('week'));
	$(parent.frames["topFrame"].document).find("#currentTrueWeek").html(week);
	$('.changeRCurrentRole').unbind('click');
	$('.changeRCurrentRole').bind('click', function(e) {
		changeRCurrentRole(e);
		e.stopPropagation();
	});
	loadUserInfo();
	stuffCurrenRoleName();
	getRemindsInfo();
})

/*
加载用户信息
*/
function loadUserInfo() {
	//渲染用户信息
	var userInfo = JSON.parse($.session.get('userInfo'));
	var yhm=getFromRedis("userName:"+userInfo.bF990_ID);
	$(parent.frames["topFrame"].document).find(".user").find("span").attr("userId",userInfo.bF990_ID); // frame获取父窗
	$(parent.frames["topFrame"].document).find(".user").find("span").html(yhm); // frame获取父窗
	if(userInfo.scdlsj==="fristTime"){
		$(".welinfo:eq(1)").hide();
	}else{
		$(".welinfo:eq(1)").find("i").html("您上次登录的时间："+userInfo.scdlsj);
		$(".welinfo:eq(1)").show();
	}
}

//填充当前角色名称
function stuffCurrenRoleName(){
	var js=JSON.parse($.session.get('allAuthority'))[0].js;
	var jsid=JSON.parse($.session.get('allAuthority'))[0].bF991_ID;
	$(".changeRCurrentRole").find('a:eq(0)').html(js);
	$(".changeRCurrentRole").find('a:eq(0)').attr("id",jsid);

	changeMenu();
}

//切换当前用户
function changeRCurrentRole(eve){
	var display =$(".canChooseRoleArea").css('display');
	if(display !== 'none'){
		$(".canChooseRoleArea,.arrow-right").hide();
		$(".user").removeClass("choseingClass");
		$(parent.frames["topFrame"].document).find(".changeRCurrentRole").css('margin','0px');
		$(parent.frames["topFrame"].document).find(".nav:eq(0)").show();
		$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find('a').show();
		return;
	}else{
		$(".user").addClass("choseingClass");
		$(parent.frames["topFrame"].document).find(".changeRCurrentRole").css('margin','0px -83px 0px -83px');
		$(parent.frames["topFrame"].document).find(".nav:eq(0)").hide();
		$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find('a').hide();
	}
	$(".canChooseRoleArea,.arrow-right").show();
	$(".canChooseRoles").find("cite").remove();
	var allJsid=JSON.parse($.session.get('allAuthority'));
	for (var i = 0; i < allJsid.length; i++) {
		if(allJsid[i]!==""){
			$(".canChooseRoles").append('<cite id="'+allJsid[i].bF991_ID+'">'+allJsid[i].js+'</cite>');
		}
	}

	$('.canChooseRoles').find("cite").unbind('click');
	$('.canChooseRoles').find("cite").bind('click', function(e) {
		confirmChangeRole(e);
		$(parent.frames["topFrame"].document).find(".changeRCurrentRole").css('margin','0px');
		$(parent.frames["topFrame"].document).find(".nav:eq(0)").show();
		$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find('a').show();
		e.stopPropagation();
	});
}

//点击确认更换当前角色
function  confirmChangeRole(eve){
	var currentRoleId=eve.currentTarget.id;
	var oldAuthoritysInfo=JSON.parse($.session.get('allAuthority'));
	var _session=$.session

	for (var i = 0; i <oldAuthoritysInfo.length ; i++) {
		if(oldAuthoritysInfo[i].bF991_ID===parseInt(currentRoleId)){
			_session.remove('authoritysInfo');
			_session.set('authoritysInfo',JSON.stringify(oldAuthoritysInfo[i]));
		}
	}
	$(parent.frames["topFrame"].document).find(".canChooseRoleArea,.arrow-right").hide();
	$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)").attr("id",currentRoleId);
	$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)").html(eve.currentTarget.innerText);
	changeMenu();
	btnControl();
	$(".user").removeClass("choseingClass");
	parent.rightFrame.location.href="index.html";

}

//获取提醒事项信息
function getRemindsInfo(){
	var userId = JSON.parse($.session.get('userInfo')).bF990_ID;
	var roleId=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a")[0].id;

	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchNotes",
		data: {
			"roleId":roleId,
			"userId":userId
		},
		dataType : 'json',
		success : function(backjson) {
			if (backjson.code===200) {
				var notReads=new Array();
				for (var i = 0; i < backjson.data.length; i++) {
					if(backjson.data[i].isHandle==="F"){
						notReads.push(backjson.data[i]);
					}
				}

				if(notReads.length>0){
					$(parent.frames["topFrame"].document).find(".user").find("i").show();
					$(parent.frames["topFrame"].document).find(".user").find("b").show();
					$(parent.frames["topFrame"].document).find(".user").find("b").unbind('click');
					$(parent.frames["topFrame"].document).find(".user").find("b").bind('click', function(e) {
						isIndexPage(backjson.data);
						e.stopPropagation();
					});

					if(notReads.length<=99){
						$(parent.frames["topFrame"].document).find(".user").find("b").html(notReads.length);
					}else{
						$(parent.frames["topFrame"].document).find(".user").find("b").html('99+');
					}
				}
			}
		}
	});
}

//判断main 定位不在index页面
function isIndexPage(reminds) {
	var thisUrl= parent.document.getElementById("rightFrame").contentWindow.location.href;
	if(thisUrl.indexOf('index.html')===-1){
		//main 定位不在index页面
		topRedRemindsAction(false,reminds);
	}else{
		//main 定位在index页面
		topRedRemindsAction(true,reminds);
	}
}

//红色数字事件
function topRedRemindsAction(isIndexPage,reminds){
	if(isIndexPage){
		$(parent.frames["rightFrame"].document).find('.mainindex').hide();
		$(parent.frames["rightFrame"].document).find('.allRemindArea').show();
		$(parent.frames["rightFrame"].document).find('#moreNoticeTable').bootstrapTable('uncheckAll');
	}else{
		window.parent.document.getElementById("rightFrame").src="index.html?isWantShowMoreReminds=true";
	}
}
