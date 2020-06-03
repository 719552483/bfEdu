$(function() {
	btnBind();
	getNoticeInfo();
});

//获取通知
function getNoticeInfo() {
	var noteId=location.href.split("?")[1].split("=")[1];
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getNoteInfoById",
		data: {
            "noteId":noteId
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
			if (backjson.result) {
				hideloding();
				stuffNotices(backjson.currentNoteInfo);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充通知
function stuffNotices(currentNoteInfo){
	$(".noticeTitleArea").html(currentNoteInfo.tzbt);
	$(".noticeBodyArea").empty();
	$(".noticeBodyArea").append(currentNoteInfo.tzzt);
}












//为已知行为的按钮绑定事件
function btnBind() {
	//面包屑-首页
	$('.backIndex,.return').unbind('click');
	$('.backIndex,.return').bind('click', function(e) {
		backToIndex();
		e.stopPropagation();
	});


}
