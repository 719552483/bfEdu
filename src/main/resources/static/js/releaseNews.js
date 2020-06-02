$(function() {
	drawEditor();
	btnBind();
	$('.isSowIndex').selectMania(); //初始化下拉框
	hideloding();
});

function drawEditor(){
	var editor1;
	/**页面初始化 创建文本编辑器工具**/
    KindEditor.ready(function(K) {
    	//定义生成编辑器的文本类型
	    	editor1 = K.create('textarea[name="content"]', {
				cssPath : 'editor/plugins/code/prettify.css',
				allowImageUpload: true, //上传图片框本地上传的功能，false为隐藏，默认为true
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
						'title', 'fontname', 'fontsize', '|', 'textcolor', 'bgcolor', 'bold',
						'italic', 'underline', 'strikethrough', 'removeformat', '|', 'image',
						'advtable', 'hr', 'emoticons', 'link', 'unlink', '|'
					]
	    	});
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
		columns: [{
				field: 'edu993_ID',
				title: 'edu993_ID',
				align: 'center',
				visible: false
			},
			{
				field: 'check',
				checkbox: true
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
		var str="modify";
		return [
				'<ul class="toolbar tabletoolbar">' 
				+'<a href="newsModify.html?newId=' + row.edu993_ID +'&&type='+str+'"><li id="modifyNews"><span><img src="images/t02.png"></span>修改</li></a>' +
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
	$(".newsDetailsTip").show();
	$(".newsDetailsForTitle").html(row.newsName);
	var backjson =
		'<h1 style="text-align:center;">sdas</h1><div style="text-align:center;"><img src="http://127.0.0.1:8848/education/editor/plugins/emoticons/etc_09.gif" border="0" /></div><div style="text-align:left;">dasdd</div>'
	$(".newsDetailsTip").find(".newsDetailsInfo").html(backjson);
}

/*管理通知按钮*/
function newsManger() {
	$(".tableArea").show();
	$(".removeChoosedNews").show();
	$(".newsInfoArea").hide();
	$(".newsManger").hide();
	$(".placeul").append('<li><a>管理通知</a></li>'); //更改位置
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
	getTableInfo();
}

/*返回消息发布*/
function returnAaaNews() {
	$(".tableArea").hide();
	$(".removeChoosedNews").hide();
	$(".newsInfoArea").show();
	$(".newsManger").show();
	$(".maskingElement").hide();
	$(".placeul").find("li:eq(2)").remove();
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

	var pushNewsObject = new Object();
	pushNewsObject.tzbt = newsTitle;
	isShow === "true" ? pushNewsObject.sfsyzs = "T" : pushNewsObject.sfsyzs = "F";
	pushNewsObject.tzzt = newsBody;
	
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
		method : 'get',
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
		newsManger();
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
