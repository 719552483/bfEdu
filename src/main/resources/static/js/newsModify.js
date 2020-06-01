$(function() {
	var newsInfo;
	btnBind();
	getNewId();
	$('.isSowIndex').selectMania(); //初始化下拉框
});

/*获取URL中的通知ID*/
function getNewId() {
	var newId = window.location.href.split("?")[1].split("&&")[0].split("=")[1];
	var type = window.location.href.split("?")[1].split("&&")[1].split("=")[1];
	
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getNoteInfoById",
		beforeSend: function(xhr) {
			requestErrorbeforeSend();
		},
		error: function(textStatus) {
			requestError();
		},
		complete: function(xhr, status) {
			requestComplete();
		},
		data: {
			"noteId":newId
		},
		dataType: 'json',
		success: function(backjson) {
			hideloding();
			if (backjson) {
				stuffCurrentNewsInfo(backjson.currentNoteInfo);
				if(type==="show"){
					$(".selectArea:eq(2)").hide();
					$(".myPlaceul").find("li:eq(2)").find("a").html("通知详情");
					editor1.readonly(true);
				}
				//发布通知按钮
				$('.modifyNews').unbind('click');
				$('.modifyNews').bind('click', function(e) {
					checkIsModify(backjson.currentNoteInfo);
					e.stopPropagation();
				});
			} else {
				toastr.warninf('操作失败');
			}
		}
	});
}

/*填充当前通知内容*/
function stuffCurrentNewsInfo(currentNoteInfo) {
	$("#newTitle").val(currentNoteInfo.tzbt);
	KindEditor.html("#newsBody", currentNoteInfo.tzzt);
	var isShow;
	currentNoteInfo.sfsyzs==="T"?isShow=true:isShow=false;
	stuffSelect(isShow);
}

/*根据值填充下拉框*/
function stuffSelect(isShow) {
	var trueHtml = '<option value="T">在首页显示</option>';
	var falseHtml = '<option value="F">不在首页显示</option>';
	var optionHtml;
	if (isShow) {
		optionHtml = trueHtml + falseHtml;
	} else {
		optionHtml = falseHtml + trueHtml;
	}
	stuffManiaSelect("#isSowIndex", optionHtml);
}

/*检查是否对通知进项了更改*/
function checkIsModify(currentNoteInfo) {
	var currentNewsInfo = new Object();
	currentNewsInfo.edu993_ID = window.location.href.split("?")[1].split("&&")[0].split("=")[1];
	currentNewsInfo.tzbt = $("#newTitle").val();
	currentNewsInfo.sfsyzs=$('#isSowIndex').selectMania('get')[0].value
	currentNewsInfo.tzzt =editor1.html(); 
	
	if (currentNoteInfo.tzbt !== currentNewsInfo.tzbt || currentNoteInfo.sfsyzs !== currentNewsInfo.sfsyzs || currentNoteInfo.tzzt !==currentNewsInfo.tzzt) {
		$.showModal("#remindModal",true);
		$(".remindType").html("通知");
		$(".remindActionType").html("修改");
		//修改通知按钮
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			confirmModify(currentNewsInfo);
			e.stopPropagation();
		});
	} else {
		$(".modifyNews").addClass("animated shake");
		//动画执行完后删除类名
		reomveAnimation('.modifyNews', "animated shake");
		toastr.warning('通知未进行任何更改');
	}
}

function confirmModify(currentNewsInfo){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/issueNotice",
		data: {
             "noticeInfo":JSON.stringify(currentNewsInfo) 
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
			if (backjson.result) {
				window.location.href = "releaseNews.html";
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}










/*为已知按钮绑定事件*/
function btnBind() {
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});
}
