$(function() {
	btnBind();
	getNoticeInfo();
	drawEditor();
});

var editor1;
//渲染编辑器
function drawEditor(){
	/**页面初始化 创建文本编辑器工具**/
  KindEditor.ready(function(K) {
  	//定义生成编辑器的文本类型
	    	editor1 = K.create('textarea[name="content"]', {
	    		        minHeight : '800px',
						cssPath : 'editor/plugins/code/prettify.css',
	    	});
	    	var autoheight=editor1.edit.doc.body.scrollHeight;//此处的editor为kindeditor
	    	editor1.edit.doc.body.style.paddingLeft="25px";
	    	editor1.edit.doc.body.style.paddingRight="25px";
	    	editor1.edit.setHeight(autoheight);
	});
}

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
			if (backjson.code===200) {
				hideloding();
				stuffNotices(backjson.data);
				editor1.readonly(); 
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//填充通知
function stuffNotices(currentNoteInfo){
	$(".noticeTitleArea").html(currentNoteInfo.title);
	KindEditor.html("#newsInfoBody", currentNoteInfo.noticeContent);
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
