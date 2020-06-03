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
				cssPath : 'editor/plugins/code/prettify.css',
				allowImageUpload: true, //上传图片框本地上传的功能，false为隐藏，默认为true--
				allowImageRemote : false, //上传图片框网络图片的功能，false为隐藏，默认为true
				formatUploadUrl:false,
			    uploadJson : '/newsImgUpload',//文件上传请求后台路径
			    afterUpload: function(url){this.sync();toastr.warning("a:"+url);}, //图片上传后，将上传内容同步到textarea中
	            afterBlur: function(){this.sync();},   ////失去焦点时，将上传内容同步到textarea中
              allowFileManager : true,
					items: ['source', '|', 'fullscreen', 'undo', 'redo', 'print', 'cut', 'copy', 'paste',
						'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
						'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
						'superscript', '|', 'selectall', '-',
						'title', 'fontname', 'fontsize','forecolor','hilitecolor', '|', 'textcolor', 'bgcolor', 'bold',
						'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
						'advtable', 'hr', 'emoticons', 'link', 'unlink', '|'
					]
	    	});
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
	KindEditor.html("#newsBody", currentNoteInfo.tzzt);
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
