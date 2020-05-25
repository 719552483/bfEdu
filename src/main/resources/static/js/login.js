$(function() {
	//登录
	$('#confrimLogin').unbind('click');
	$('#confrimLogin').bind('click', function(e) {
		btnBind();
		e.stopPropagation();
	});
});

function btnBind() {
	$.ajax({
		method: 'post',
		cache: false,
		url: "/verifyUser",
		data: {
			"username": $("#username").val(),
			"password":  $("#password").val()
		},
		dataType: 'json',
		success: function(backjson) {
			if(backjson.result) {
				var userInfo = $.session.get('userInfo');
			    if(userInfo==="undefined"||userInfo===undefined){
			    	$.session.set('userInfo', backjson.UserInfo);
			    }else{
			    	$.session.remove('userInfo');
			    	$.session.set('userInfo', backjson.UserInfo);
			    }
				window.location.href = "main.html";
			} else {
				toastr.warning('登陆失败');
			}
		}
	});
}