$(function() {
	drawEditor();
	btnBind();
	getUsefulDepartment();
	getSendArea();
	hideloding();
	$('.isSowIndex').selectMania(); //初始化下拉框
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

//根据当前角色获取可选系部
function getUsefulDepartment(){
	$.ajax({
		method: 'get',
		cache: false,
		url: "/getUsefulDepartment",
		data: {
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
		},
		dataType: 'json',
		beforeSend: function (xhr) {
			requestErrorbeforeSend();
		},
		error: function (textStatus) {
			requestError();
		},
		complete: function (xhr, status) {
			requestComplete();
		},
		success: function (backjson) {
			hideloding();
			if (backjson.code===200) {
				var str='';
				if(backjson.data.length===0){
					toastr.warning("暂无可选系部");
				}else{
					str='<option value="seleceConfigTip">请选择</option>';
					for (var i = 0; i < backjson.data.length; i++) {
						str += '<option value="' + backjson.data[i].edu104_ID + '">' + backjson.data[i].xbmc
							+ '</option>';
					}
				}
				stuffManiaSelect("#department", str);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取发送范围
function getSendArea(){
	$.ajax({
		method : 'get',
		cache : false,
		async :false,
		url : "/getEJDM",
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
			if (backjson.code == 200) {
				var str='<option value="seleceConfigTip">请选择</option>';
				var fsfw=backjson.data.allEJDM.fsfw;
				for (var i = 0; i < fsfw.length; i++) {
						str += '<option value="' + fsfw[i].ejdm + '">' + fsfw[i].ejdmz
							+ '</option>';
				}
				stuffManiaSelect("#sendArea", str);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//获取所有通知
function getTableInfo() {
	$.ajax({
		method : 'get',
		cache : false,
		url : "/getNotices",
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
				stuffReleaseNewsTable(backjson.allNotices);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//渲染通知表格
function stuffReleaseNewsTable(tableInfo) {
	window.releaseNewsEvents = {
		'click #removeNews': function(e, value, row, index) {
			removeNews(row);
		},
		'click #newsDetails': function(e, value, row, index) {
			newsDetails(row);
		},'click #modifyNews': function(e, value, row, index) {
			modifyNews(row,index);
		}
	};

	$('#releaseNewsTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
		pagination: true,
		pageNumber: 1,
		pageSize: 10,
		pageList: [10],
		showToggle: false,
		showFooter: false,
		search: true,
		editable: false,
		striped: true,
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".tableArea", "通知");
		},
		columns: [
			{
				field: 'check',
				checkbox: true
			},{
				field: 'edu993_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			},
			{
				field: 'tzbt',
				title: '通知名称',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'fbsj',
				title: '发布日期',
				align: 'left',
				formatter: paramsMatter,
			}, {
				field: 'sfsyzs',
				title: '页面是否显示',
				formatter: switchFormatter,
				align: 'center',
				width: '10%'
			}, {
				field: 'action',
				title: '操作',
				align: 'center',
				width: '16%',
				formatter: releaseNewsFormatter,
				events: releaseNewsEvents,
			}
		]
	});

	function switchFormatter(value, row, index) {
		if (row.sfsyzs==="T") {
			return [
					'<section newsId="' + row.edu993_ID +'" currentStatus="'+row.sfsyzs+'" class="model-1"><div class="checkbox mycheckbox"><input class="isShowControl" type="checkbox" checked="checked"><label></label></div></section>'
				]
				.join('');
		} else {
			return [
					'<section newsId="' + row.edu993_ID +'" currentStatus="'+row.sfsyzs+'" class="model-1"><div class="checkbox mycheckbox"><input class="isShowControl" type="checkbox"><label></label></div></section>'
				]
				.join('');
		}
	}

	function dateFormatter(value, row, index) {
		return [
				'<cite class="myTooltip" title="'+formatterTimeToPage(row.releaseDate, true)+'">' + formatterTimeToPage(row.releaseDate, true) + '</cite>'
			]
			.join('');
	}

	function releaseNewsFormatter(value, row, index) {
		return [
				'<ul class="toolbar tabletoolbar">' 
				+'<li id="modifyNews"><span><img src="images/t02.png"></span>修改</li>' +
				'<li id="removeNews"><span><img src="images/t03.png"></span>删除</li>' +
				'<li id="newsDetails"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
				'</ul>'
			]
			.join('');
	}
	
	drawPagination(".tableArea", "通知");
	changeColumnsStyle(".tableArea", "通知");
	drawSearchInput(".tableArea");
	changeTableNoRsTip();
	toolTipUp(".myTooltip");
	btnControl();
	isShowControlBind();
}

//修改通知
function modifyNews(row,index){
	$(".tableArea,.newsManger,.formtext,.removeChoosedNews").hide();
	$(".newsInfoArea,.submitNews").show();
	$(".placeul").find("li:eq(2)").find("a").html("修改通知");
	$("#newTitle").val(row.tzbt);
	KindEditor.html("#newsBody", row.tzzt);
	var isShow;
	row.sfsyzs==="T"?isShow=true:isShow=false;
	stuffSelect(isShow);
	$(".submitNews")[0].defaultValue="确认修改";
	
	//返回按钮
	$('.return').unbind('click');
	$('.return').bind('click', function(e) {
		$(".placeul").find("li:eq(2)").remove();
		newsManger(false);
		e.stopPropagation();
	});
	
	//确认修改按钮
	$('.submitNews').unbind('click');
	$('.submitNews').bind('click', function(e) {
		checkIsModify(row,index);
		e.stopPropagation();
	});
}

/*检查是否对通知进项了更改*/
function checkIsModify(currentNoteInfo,index) {
	if ($("#newTitle").val() === "") {
		toastr.warning('通知标题不能为空');
		$(".submitNews").addClass("animated shake");
		//动画执行完后删除类名
		reomveAnimation('.submitNews', "animated shake");
		return;
	}
	if (editor1.html() === "") {
		toastr.warning('通知主体不能为空');
		$(".submitNews").addClass("animated shake");
		//动画执行完后删除类名
		reomveAnimation('.submitNews', "animated shake");
		return;
	}
	
	var currentNewsInfo = new Object();
	currentNewsInfo.edu993_ID = currentNoteInfo.edu993_ID;
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
			confirmModify(currentNewsInfo,index);
			e.stopPropagation();
		});
	} else {
		$(".submitNews").addClass("animated shake");
		//动画执行完后删除类名
		reomveAnimation('.submitNews', "animated shake");
		toastr.warning('通知未进行任何更改');
	}
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

//确认修改通知
function confirmModify(currentNewsInfo,index){
	$.ajax({
		method : 'post',
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
				$('#releaseNewsTable').bootstrapTable('updateRow', {
					index: index,
					row: currentNewsInfo
				});
				$.hideModal();
				newsManger(false,false);
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//switch事件绑定
function isShowControlBind() {
	$('.isShowControl').unbind('click');
	$('.isShowControl').bind('click', function(e) {
		changNewsIshow(e.currentTarget.parentNode.parentNode.attributes[0].nodeValue,e.currentTarget.parentNode.parentNode.attributes[1].nodeValue,e);
		e.stopPropagation();
	});
}

//改变是否页面展示
function changNewsIshow(currentNewId,currentStatus,e) {
	var newStatus="";
	currentStatus==="T"?newStatus="F":newStatus="T";
		
	$.ajax({
		method : 'get',
		cache : false,
		url : "/changeNoticeIsShowIndex",
		data: {
             "noticeId":currentNewId,
             "isShow":newStatus 
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
				//不确定是否在Index页面已删除???
				toastr.success('操作成功');
				e.currentTarget.parentNode.parentNode.attributes[1].nodeValue=newStatus;
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

/*单选删除通知*/
function removeNews(row) {
	$.showModal("#remindModal",true);
	$(".remindType").html("通知");
	$(".remindActionType").html("删除");

	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var removeNewsArray = new Array;
		removeNewsArray.push(row.edu993_ID);
		sendStudentRemoveInfo(removeNewsArray);
		e.stopPropagation();
	});

}

/*多选删除通知*/
function removeChoosedNews() {
	var chosenNews = $('#releaseNewsTable').bootstrapTable('getAllSelections');
	if (chosenNews.length === 0) {
		toastr.warning('暂未选择任何通知');
	} else {
		var removeNewsArray = new Array;
		$.showModal("#remindModal",true);
		$(".remindType").html("已选通知");
		$(".remindActionType").html("删除");

		for (var i = 0; i < chosenNews.length; i++) {
			removeNewsArray.push(chosenNews[i].edu993_ID);
		}
		$('.confirmRemind').unbind('click');
		$('.confirmRemind').bind('click', function(e) {
			sendStudentRemoveInfo(removeNewsArray);
			e.stopPropagation();
		});

	}
}

//发送删除通知请求
function sendStudentRemoveInfo(removeArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/removeNotices",
		data: {
             "removeInfo":JSON.stringify(removeArray) 
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
				tableRemoveAction("#releaseNewsTable", removeArray, ".tableArea", "通知");
				$.hideModal("#remindModal");
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

/*查看消息详情*/
function newsDetails(row) {
	editor1.readonly();  
	$(".tableArea,.newsManger,.formtext,.removeChoosedNews,.submitNews,.tipTxt").hide();
	$(".newsInfoArea").show();
	$(".placeul").find("li").last()[0].innerText="通知详情";
	$("#newTitle").val(row.tzbt);
	KindEditor.html("#newsBody", row.tzzt);
	var isShow;
	row.sfsyzs==="T"?isShow=true:isShow=false;
	stuffSelect(isShow);
	$(".submitNews")[0].defaultValue="确认修改";
	
	//返回按钮
	$('.return').unbind('click');
	$('.return').bind('click', function(e) {
		$(".placeul").find("li:eq(2)").remove();
		newsManger(false);
		editor1.readonly(false);  
		e.stopPropagation();
	});
}

/*管理通知按钮*/
function newsManger(loadData,appendLoacl) {
	$(".tableArea").show();
	$(".removeChoosedNews").show();
	$(".newsInfoArea").hide();
	$(".newsManger").hide();
	if (typeof appendLoacl === 'undefined') {
		$(".placeul").append('<li><a>管理通知</a></li>'); //更改位置
	}else{
		$(".placeul").find("li").last()[0].innerText="管理通知";
	}
	
	
	//返回按钮重新绑定事件
	$('.return').unbind('click');
	$('.return').bind('click', function(e) {
		returnAaaNews();
		e.stopPropagation();
	});
	//面包屑导航绑定事件
	$(".placeul").find("li:eq(1)").bind('click', function(e) {
		returnAaaNews();
		e.stopPropagation();
	});
	//获取所有通知
	if(loadData){
		getTableInfo();
	}
}

/*返回消息发布*/
function returnAaaNews() {
	$(".tableArea,.removeChoosedNews").hide();
	$(".newsInfoArea,.formtext,.newsManger").show();
	$(".placeul").find("li:eq(2)").remove();
	$("#newTitle").val("");
	KindEditor.html("#newsBody", "");
	stuffSelect(true);
	$(".submitNews")[0].defaultValue="确认发布";
	//返回按钮
	$('.return').unbind('click');
	$('.return').bind('click', function(e) {
		backToIndex();
		e.stopPropagation();
	});
}

/*发布新通知*/
function pushNews() {
	var newsTitle = $("#newTitle").val();
	var isShow = $('#isSowIndex').selectMania('get')[0].value;
	var newsBody = $('#newsBody').val();
	var department = getNormalSelectValue("department");
	var sendArea =getNormalSelectValue("#sendArea");
	if (newsTitle === "") {
		toastr.warning('通知标题不能为空');
		$(".submitNews").addClass("animated shake");
		//动画执行完后删除类名
		reomveAnimation('.submitNews', "animated shake");
		return;
	}
	if (newsBody === "") {
		toastr.warning('通知主体不能为空');
		$(".submitNews").addClass("animated shake");
		//动画执行完后删除类名
		reomveAnimation('.submitNews', "animated shake");
		return;
	}
	if (department === "") {
		toastr.warning('请选择消息发送的二级学院');
		$(".submitNews").addClass("animated shake");
		//动画执行完后删除类名
		reomveAnimation('.submitNews', "animated shake");
		return;
	}
	if (sendArea === "") {
		toastr.warning('请选择消息的发送范围');
		$(".submitNews").addClass("animated shake");
		//动画执行完后删除类名
		reomveAnimation('.submitNews', "animated shake");
		return;
	}

	var pushNewsObject = new Object();
	pushNewsObject.Edu104_ID = department;
	pushNewsObject.Edu101_ID = $(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	pushNewsObject.departmentName=getNormalSelectValue("department");
	pushNewsObject.senderName=$(parent.frames["topFrame"].document).find(".userName")[0].innerText;
	pushNewsObject.noticeType = sendArea;
	isShow === "true" ? pushNewsObject.showInIndex = "T" : pushNewsObject.showInIndex = "F";
	pushNewsObject.title = newsTitle;
	pushNewsObject.noticeContent = newsBody;

	$.showModal("#remindModal",true);
	$(".remindType").html("新通知");
	$(".remindActionType").html("发布");
	//发布通知按钮
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		confirmPushNews(pushNewsObject);
		e.stopPropagation();
	});
}

//确认发布
function confirmPushNews(pushNewsObject) {
	$.ajax({
		method : 'post',
		cache : false,
		url : "/issueNotice",
		data: {
             "noticeInfo":JSON.stringify(pushNewsObject) 
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
				window.location.href = "index.html";
				//首页消息表根据新通知的是否首页展示新增消息
				backToIndex();
			} else {
				toastr.warning('操作失败，请重试');
			}
		}
	});
}

//为已知行为的按钮绑定事件
function btnBind() {
	//面包屑-首页
	$('.backIndex').unbind('click');
	$('.backIndex').bind('click', function(e) {
		backToIndex();
		e.stopPropagation();
	});

	//上方删除按钮
	$('.removeChoosedNews').unbind('click');
	$('.removeChoosedNews').bind('click', function(e) {
		removeChoosedNews();
		e.stopPropagation();
	});

	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//管理通知按钮
	$('.newsManger').unbind('click');
	$('.newsManger').bind('click', function(e) {
		newsManger(true);
		e.stopPropagation();
	});

	//返回按钮
	$('.return').unbind('click');
	$('.return').bind('click', function(e) {
		backToIndex();
		e.stopPropagation();
	});

	//发布通知按钮
	$('.submitNews').unbind('click');
	$('.submitNews').bind('click', function(e) {
		pushNews();
		e.stopPropagation();
	});
}
