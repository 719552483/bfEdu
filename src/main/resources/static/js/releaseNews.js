$(function() {
	btnBind();
	$('.isSowIndex').selectMania(); //初始化下拉框
});

//获取所有通知
function getTableInfo() {
	// 发送查询所有用户请求
	// $.ajax({
	//  method : 'get',
	//  cache : false,
	//  url : "/queryDrgGroupIntoInfo",
	//  dataType : 'json',
	//  success : function(backjson) {
	// 	 if (backjson.result) {
	// 		 stuffDrgGroupMangerTable(backjson);
	// 	 } else {
	// 		 jGrowlStyleClose('操作失败，请重试');
	// 	 }
	//  }
	// });
	var tableInfo = {
		"newsInfo": [{
			"id": "id1",
			"newsName": "上海自dd贸区今日正式挂牌成立",
			"isShow": true,
			"releaseDate": "20191211000000",
		}, {
			"id": "id2",
			"newsName": "上海自贸区今日正式挂牌成立",
			"isShow": true,
			"releaseDate": "20191211000000",
		}]
	}
	stuffReleaseNewsTable(tableInfo);
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
		data: tableInfo.newsInfo,
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
		showColumns: false,
		onPageChange: function() {
			drawPagination(".tableArea", "通知");
		},
		columns: [{
				field: 'id',
				title: 'id',
				align: 'center',
				visible: false
			},
			{
				field: 'check',
				checkbox: true
			},
			{
				field: 'newsName',
				title: '通知名称',
				align: 'left',
				formatter: paramsMatter
			}, {
				field: 'releaseDate',
				title: '发布日期',
				align: 'left',
				formatter: dateFormatter,
			}, {
				field: 'isShow',
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
		if (row.isShow) {
			return [
					'<section newsId="' + row.id +
					'" class="model-1 isShowControl"><div class="checkbox mycheckbox"><input type="checkbox" checked="checked"><label></label></div></section>'
				]
				.join('');
		} else {
			return [
					'<section newsId="' + row.id +
					'" class="model-1 isShowControl"><div class="checkbox mycheckbox"><input type="checkbox"><label></label></div></section>'
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
				'<ul class="toolbar tabletoolbar">' +
				'<a href="newsModify.html?newId=' + row.id +
				'"><li id="modifyNews"><span><img src="images/t02.png"></span>修改</li></a>' +
				'<li id="removeNews"><span><img src="images/t03.png"></span>删除</li>' +
				'<li id="newsDetails"><span><img src="img/info.png" style="width:24px"></span>详情</li>' +
				'</ul>'
			]
			.join('');
	}
	drawPagination(".tableArea", "通知");
	drawSearchInput();
	isShowControlBind();
	toolTipUp(".myTooltip");
}

function isShowControlBind(e) {
	$('.isShowControl').unbind('click');
	$('.isShowControl').bind('click', function(e) {
		changNewsIshow(e.currentTarget.attributes[0].nodeValue);
		e.stopPropagation();
	});
}

function changNewsIshow(currentNewId) {
	// var 
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

	//不确定是否在Index页面已删除???
	toastr.success('操作成功');
}

/*单选删除通知*/
function removeNews(row) {
	$(".removeNewsTip").show();
	showMaskingElement();
	$(".removeNewsTip").find(".tipTitle").html("删除");

	$('.removeNewsTip_confirmBtn').unbind('click');
	$('.removeNewsTip_confirmBtn').bind('click', function(e) {
		var removeNewsArray = new Array;
		removeNewsArray.push(row.id);
		removeNewsAjaxDemo("#releaseNewsTable", removeNewsArray,".tableArea", "通知");
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
		$(".removeNewsTip").show();
		showMaskingElement();
		$(".removeNewsTip").find(".tipTitle").html("删除");
		for (var i = 0; i < chosenNews.length; i++) {
			removeNewsArray.push(chosenNews[i].id);
		}
		$('.removeNewsTip_confirmBtn').unbind('click');
		$('.removeNewsTip_confirmBtn').bind('click', function(e) {
			removeNewsAjaxDemo("#releaseNewsTable", removeNewsArray,".tableArea", "通知");
			e.stopPropagation();
		});

	}
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
	showMaskingElement();
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
	var newsBody = KE.util.getData("newsBody");
	var date = getCrrruentDate();
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
	pushNewsObject.title = newsTitle;
	isShow === "true" ? pushNewsObject.isShow = "T" : pushNewsObject.isShow = "F";
	pushNewsObject.date = date;
	pushNewsObject.body = newsBody;
	$(".pushNewsTip").show();
	showMaskingElement();
	//发布通知按钮
	$('.pushNewsTip_confirmBtn').unbind('click');
	$('.pushNewsTip_confirmBtn').bind('click', function(e) {
		confirmPushNews(pushNewsObject);
		e.stopPropagation();
	});
}

function confirmPushNews(pushNewsObject) {
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
	window.location.href = "index.html";
	backToIndex();
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
	$('.cancelBtn,.shortcutsCancelBtn').unbind('click');
	$('.cancelBtn,.shortcutsCancelBtn').bind('click', function(e) {
		$(".tip").hide();
		showMaskingElement();
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
