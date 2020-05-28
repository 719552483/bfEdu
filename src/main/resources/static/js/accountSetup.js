$(function() {
	btnBind();
	stuffTimeStamp();
});

//填充登录时间
function stuffTimeStamp(){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTeachingClassQueryAdministrationClassesLibrary",
		data: {
             "culturePlanInfo":JSON.stringify(notNullSearchs),
             "SearchCriteria":JSON.stringify(searchObject) 
        },
		dataType : 'json',
		beforeSend: function(xhr) {
			requestErrorbeforeSend();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
		success : function(backjson) {
			hideloding();
			$(".loginTimeStamp").html(formatterTimeToPage(backjson,true));
		}
	});
//	var backjson="20200226145600";
//	$(".loginTimeStamp").html(formatterTimeToPage(backjson,true));
}


//按钮绑定事件
function btnBind(){
	$('.saveNewAccountSetUp').unbind('click');
	$('.saveNewAccountSetUp').bind('click', function(e) {
		getNewAccountSetup();
		e.stopPropagation();
	});
}

//获取新的用户设置
function getNewAccountSetup(){
	var username=$("#setup_username").val();
	var pwd=$("#setup_pwd").val();
	var confirmPwd=$("#setup_confirmPwd").val();
	verifyNewAccountSetup(username,pwd,confirmPwd);
}

//验证新用户设置
function verifyNewAccountSetup(username,pwd,confirmPwd){
	//空检查
	if(username===""){
		toastr.warning('用户名不能为空');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}
	
	if(pwd===""){
		toastr.warning('密码不能为空');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}
	
	if(confirmPwd===""){
		toastr.warning('确认密码不能为空');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}
	
	//新旧密码对比
	if(pwd!==confirmPwd){
		toastr.warning('确认密码不正确');
		$(".saveNewAccountSetUp").addClass("animated shake");
		reomveAnimation('.saveNewAccountSetUp', "animated shake");
		return;
	}
	
	//规则检查   todo
	
	//保存新用户设置
	saveNewAccountSetUp(username,pwd,confirmPwd);
}

function saveNewAccountSetUp(username,pwd,confirmPwd){
	// $.ajax({
	// 	method : 'get',
	// 	cache : false,
	// 	url : "testJson/getIndexChartsInfo.json",
	// 	dataType : 'json',
	// 	success : function(backjson) {
	// 		showCostConsumption(backjson);
	// 		showMdc(backjson);
	// 		showOfficeCount(backjson);
	// 		showDoctorsStatistical(backjson);
	// 	}
	// });
	toastr.success('用户设置已更新');
	$("#setup_username,#setup_pwd,#setup_confirmPwd").val("");
}