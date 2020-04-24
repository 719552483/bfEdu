$(function() {
	var newsInfo;
	btnBind();
	getNewId();
	$('.isSowIndex').selectMania(); //初始化下拉框
});

/*获取URL中的通知ID*/
function getNewId() {
	var newId = window.location.href.split("?")[1].split("=")[1];
	// 发送查询所有用户请求
	// $.ajax({
	// 	method: 'get',
	// 	cache: false,
	// 	url: "mapJson/test.json",
	// 	data: {
	// 		"newShortcut": JSON.stringify(news)
	// 	},
	// 	dataType: 'json',
	// 	success: function(backjson) {
	// 		if (backjson.result) {
	// 			for (var i = 0; i < news.length; i++) {
	// 					$('#releaseNewsTable').bootstrapTable('removeByUniqueId',news[i]);
	// 			}
	// 			$(".tip").hide();
	// 			drawPagination("通知");
	// 			toastr.success('删除成功');
	// 		} else {
	// 			toastr.error('操作失败');
	// 		}
	// 	}
	// });
	newsInfo = {
		"id": "id1",
		"newsName": "上海自贸区今日正式挂牌成立",
		"isShow": true,
		"releaseDate": "20191211000000",
		"newsBody": "<ol><li>fsafsafsdafds〓</li></ol>",
	}
	stuffCurrentNewsInfo();
}

/*填充当前通知内容*/
function stuffCurrentNewsInfo() {
	$("#newTitle").val(newsInfo.newsName);
	stuffSelect(newsInfo.isShow);
	$("#newsBody").html(newsInfo.newsBody);
}

/*根据值填充下拉框*/
function stuffSelect(isShow) {
	var trueHtml = '<option value="true">在首页显示</option>';
	var falseHtml = '<option value="false">不在首页显示</option>';
	var optionHtml;
	if (isShow) {
		optionHtml = trueHtml + falseHtml;
	} else {
		optionHtml = falseHtml + trueHtml;
	}
	$("#isSowIndex").append(optionHtml);
}

/*检查是否对通知进项了更改*/
function checkIsModify() {
	var currentNewsInfo = new Object();
	currentNewsInfo.id = newsInfo.id;
	currentNewsInfo.releaseDate = newsInfo.releaseDate;
	currentNewsInfo.newsName = $("#newTitle").val();
	$('#isSowIndex').selectMania('get')[0].value === "true" ? currentNewsInfo.isShow = true : currentNewsInfo.isShow =
		false;
	currentNewsInfo.newsBody = KE.util.getData("newsBody");
	if (newsInfo.newsName !== currentNewsInfo.newsName || newsInfo.isShow !== currentNewsInfo.isShow || newsInfo.newsBody !==
		currentNewsInfo.newsBody) {
		$(".modifiDetailsTip").show();
		showMaskingElement();
		$(".modifiDetailsTip").find(".tipTitle").html("修改");
		$('.modifiDetailsTip_confirmBtn').unbind('click');
		$('.modifiDetailsTip_confirmBtn').bind('click', function(e) {
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
	// 发送查询所有用户请求
	// $.ajax({
	// 	method: 'get',
	// 	cache: false,
	// 	url: "mapJson/test.json",
	// 	data: {
	// 		"newShortcut": JSON.stringify(news)
	// 	},
	// 	dataType: 'json',
	// 	success: function(backjson) {
	// 		if (backjson.result) {
	// 			for (var i = 0; i < news.length; i++) {
	// 					$('#releaseNewsTable').bootstrapTable('removeByUniqueId',news[i]);
	// 			}
	// 			$(".tip").hide();
	// 			drawPagination("通知");
	// 			toastr.success('删除成功');
	// 		} else {
	// 			toastr.error('操作失败');
	// 		}
	// 	}
	// });
	window.location.href = "releaseNews.html";
	$(".maskingElement").hide();
	$(parent.frames["topFrame"].document).find(".maskingElement").hide(); //frame获取父窗
	$(parent.frames["leftFrame"].document).find(".maskingElement").hide(); //frame获取父窗
}










/*为已知按钮绑定事件*/
function btnBind() {
	//发布通知按钮
	$('.modifyNews').unbind('click');
	$('.modifyNews').bind('click', function(e) {
		checkIsModify();
		e.stopPropagation();
	});
	
	//提示框取消按钮
	$('.cancelBtn,.shortcutsCancelBtn').unbind('click');
	$('.cancelBtn,.shortcutsCancelBtn').bind('click', function(e) {
		$(".modifiDetailsTip").hide();
		showMaskingElement();
		e.stopPropagation();
	});
	
}
