$(function() {
	btnBind();
	stuffTimeStamp();
});

//填充登录时间
function stuffTimeStamp(){
	var userId=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/queryUserById",
		data: {
             "userId":userId
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
			$(".loginTimeStamp").html(backjson.userInfo.scdlsj);
		}
	});
}


//按钮绑定事件
function btnBind(){
	$('.saveNewAccountSetUp').unbind('click');
	$('.saveNewAccountSetUp').bind('click', function(e) {
		getNewAccountSetup();
		e.stopPropagation();
	});
	
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
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
	$.showModal("#remindModal",true);
	$(".remindType").html("账号");
	$(".remindActionType").html("设置");
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		saveNewAccountSetUp(username,pwd,confirmPwd);
		e.stopPropagation();
	});
}

//保存新用户设置
function saveNewAccountSetUp(username,pwd,confirmPwd){
	var modifyObject = new Object();
	modifyObject.BF990_ID = $(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	modifyObject.yhm = username;
	modifyObject.mm = pwd;
	$.ajax({
		method : 'get',
		cache : false,
		url : "/userSetup",
		data: {
            "accountSetupInfo":JSON.stringify(modifyObject)
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
			$.hideModal("#remindModal");
			if(backjson.userNameHave){
				toastr.warning('用户名已存在');
				return;
			}
			var userInfo = JSON.parse($.session.get('userInfo'));
			userInfo.yhm=username;
			$.session.remove('userInfo');
			$.session.set('userInfo', JSON.stringify(userInfo));
			toastr.success('用户设置已更新');
			$(parent.frames["topFrame"].document).find(".userName")[0].innerText=username;
			$("#setup_username,#setup_pwd,#setup_confirmPwd").val("");
		}
	});

}