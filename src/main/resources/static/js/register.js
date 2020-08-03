$(function() {
	//登录
	$('#confrimRegister').unbind('click');
	$('#confrimRegister').bind('click', function(e) {
		register();
		e.stopPropagation();
	});
	
	 // 俘获 enter 键
	$(document).keyup(function (e) {
	    if (e.keyCode === 13) {
	    	register();
	    }
	});
});

function register(){
	if($(".loginuser").val()===""){
		toastr.warning('用户名不能为空');
		return
	}
	if($(".loginpwd").val()===""){
		toastr.warning('密码不能为空');
		return
	}
	comfirmRegisterUser($(".loginuser").val(),$(".loginpwd").val());
}

function comfirmRegisterUser(username,password) {
	$.ajax({
		method: 'post',
		cache: false,
		url: "/registerUser",
		data: {
			"username": username,
			"password":  password
		},
		dataType: 'json',
		success: function(backjson) {
			if(backjson.result) {
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
				toastr.warning("操作失败,请重试");
			}
		}
	});
}

