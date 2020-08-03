$(function() {
	checkHaveSysUser();
	//登录
	$('#confrimLogin').unbind('click');
	$('#confrimLogin').bind('click', function(e) {
		login();
		e.stopPropagation();
	});
	
	 // 俘获 enter 键
	$(document).keyup(function (e) {
	    if (e.keyCode === 13) {
	        login();
	    }
	});
});

//检查有没有系统用户
function checkHaveSysUser(){
	$.ajax({
		method : 'get',
		cache : false,
		async :false,
		url : "/checkHaveSysUser",
		dataType : 'json',
		success : function(backjson) {
			if (!backjson.haveSysUser) {
				window.location.href = "register.html";
			}
		}
	});
}


function login(){
	if($(".loginuser").val()===""){
		toastr.warning('用户名不能为空');
		return
	}
	if($(".loginpwd").val()===""){
		toastr.warning('密码不能为空');
		return
	}
	comfirmLogin($(".loginuser").val(),$(".loginpwd").val());
}

function comfirmLogin(username,password) {
	$.ajax({
		method: 'post',
		cache: false,
		url: "/verifyUser",
		data: {
			"username": username,
			"password":  password
		},
		dataType: 'json',
		success: function(backjson) {
			if(backjson.result) {
				//注册？？？
				var userInfo = $.session.get('userInfo');
			    if(userInfo==="undefined"||userInfo===undefined){
			    	$.session.set('userInfo', backjson.UserInfo);
			    	$.session.set('authoritysInfo', backjson.authoritysInfo);
			    }else{
			    	$.session.remove('userInfo');
			    	$.session.remove('authoritysInfo');
			    	$.session.set('userInfo', backjson.UserInfo);
			    	$.session.set('authoritysInfo', backjson.authoritysInfo);
			    }
				window.location.href = "main.html";
			} else {
				toastr.warning(backjson.ErroeTxt);
			}
		}
	});
}