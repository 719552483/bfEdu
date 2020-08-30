$(function() {
	$('.isSowIndex').selectMania(); // 初始化下拉框
	EJDMElementInfo=queryEJDMElementInfo();
	stuffEJDElement(EJDMElementInfo)
	drawTaskEmptyTable();
	btnBind();
});

//填充空的可申请表
function drawTaskEmptyTable() {
	stuffTaskInfoTable({});
}

//渲染可申请表
function stuffTaskInfoTable(tableInfo) {
	window.scheduleClassesEvents = {
		'click #askForExam': function(e, value, row, index) {
			askForExam(row,index);
		}
	};

	$('#askForExamTable').bootstrapTable('destroy').bootstrapTable({
		data: tableInfo,
		pagination: true,
		pageNumber: 1,
		pageSize : 10,
		pageList : [ 10 ],
		showToggle: false,
		showFooter: false,
		clickToSelect: true,
		search: true,
		editable: false,
		exportDataType: "all",
		showExport: true,      //是否显示导出
		exportOptions:{
			fileName: '可申请考试课程导出'  //文件名称
		},
		striped: true,
		sidePagination: "client",
		toolbar: '#toolbar',
		showColumns: true,
		onPageChange: function() {
			drawPagination(".askForExamTableArea", "可申请课程");
		},
		columns: [
			{
				field: 'check',
				checkbox: true
			},
			{
				field: 'edu201_ID',
				title: '唯一标识',
				align: 'center',
				visible: false
			},
			{
				field: 'className',
				title: '班级',
				align: 'left',
				clickToSelect: false,
				formatter: paramsMatter
			}, {
				field: 'kcmc',
				title: '课程',
				align: 'left',
				formatter: paramsMatter
			},	{
				field: 'jxbrs',
				title: '教学班人数',
				align: 'left',
				formatter: paramsMatter
			},{
				field: 'sfxylcj',
				title: '是否需要录成绩',
				align: 'left',
				clickToSelect: false,
				formatter: sfxylcjMatter
			},{
				field: 'zxs',
				title: '总学时',
				align: 'left',
				formatter: paramsMatter
			},{
				field: 'kkbm',
				title: '开课部门',
				align: 'left',
				formatter: paramsMatter,
				clickToSelect: false
			},{
				field: 'pkbm',
				title: '排课部门',
				align: 'left',
				formatter: paramsMatter,
				clickToSelect: false
			},{
				field: 'action',
				title: '操作',
				align: 'center',
				clickToSelect: false,
				formatter: scheduleClassesFormatter,
				events: scheduleClassesEvents,
			}
		]
	});

	function scheduleClassesFormatter(value, row, index) {
		return [
			'<ul class="toolbar tabletoolbar">' +
			'<li id="askForExam"><span><img src="img/confirm.png" style="width:24px"></span>申请考试</li>' +
			'</ul>'
		]
			.join('');
	}

	function sfxylcjMatter(value, row, index) {
		if (row.sfxylcj==="T") {
			return [
				'<section class="model-1"><div class="checkbox mycheckbox"><input index="'+index+'" class="sfxylcjControl" id="sfxylcjControl'+index+'" type="checkbox" checked="checked"><label></label></div></section>'
			]
				.join('');
		} else {
			return [
				'<section class="model-1"><div class="checkbox mycheckbox"><input index="'+index+'" class="sfxylcjControl" id="sfxylcjControl'+index+'" type="checkbox"><label></label></div></section>'
			]
				.join('');
		}
	}

	drawPagination(".askForExamTableArea", "可申请课程");
	drawSearchInput(".askForExamTableArea");
	changeTableNoRsTip();
	changeColumnsStyle( ".askForExamTableArea", "可申请课程");
	toolTipUp(".myTooltip");
}

//预备单个申请考试
function askForExam(row,index){
	$.showModal("#remindModal",true);
	$(".remindType").html("课程-"+row.kcmc);
	$(".remindActionType").html("  考试申请");
	//确认发布任务书
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var sendArray=new Array();
		sendArray.push(row.edu201_ID);
		sendExamAsk(sendArray);
		e.stopPropagation();
	});
}

//预备批量申请考试
function askForExams(){
	var choosend = $("#askForExamTable").bootstrapTable("getSelections");
	if(choosend.length===0){
		toastr.warning('暂未选择课程');
		return;
	}
	$.showModal("#remindModal",true);
	$(".remindType").html("所选课程");
	$(".remindActionType").html("考试申请");
	//确认发布任务书
	$('.confirmRemind').unbind('click');
	$('.confirmRemind').bind('click', function(e) {
		var sendArray=new Array();
		for (var i = 0; i < choosend.length; i++) {
			sendArray.push(choosend[i].edu201_ID);
		}
		sendExamAsk(sendArray);
		e.stopPropagation();
	});

}

//发送考试申请
function sendExamAsk(sendArray){
	$.ajax({
		method : 'get',
		cache : false,
		url : "/askForExam",
		data: {
			"tasks":JSON.stringify(sendArray) ,
			"approvalInfo":JSON.stringify(getApprovalobect())
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
			if (backjson.code===200) {
				for (var i = 0; i < sendArray.length; i++) {
					$("#askForExamTable").bootstrapTable('removeByUniqueId', sendArray[i]);
				}
				$.hideModal("#remindModal");
				toastr.success(backjson.msg);
			} else {
				toastr.warning(backjson.msg);
			}
		}
	});
}

//开始检索
function startSearch(){
	var serachObject=getSearchObject();
	$.ajax({
		method : 'get',
		cache : false,
		url : "/searchTaskCanTest",
		data: {
			"searchCriteria":JSON.stringify(serachObject),
			"userId":$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue
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
			if (backjson.code===200) {
				stuffTaskInfoTable(backjson.data);
			} else {
				toastr.warning(backjson.msg);
				drawTaskEmptyTable();
			}
		}
	});
}

//获取检索对象
function getSearchObject(){
	var courseCode=$("#courseCode").val();
	var courseName=$("#courseName").val();
	var coursesNature=getNormalSelectValue("coursesNature");
	var className=$("#className").val();
	var SearchObject=new Object();
	SearchObject.courseCode=courseCode;
	SearchObject.courseName=courseName;
	SearchObject.coursesNature=coursesNature;
	SearchObject.className=className;
	return SearchObject;
}

//获得审批流对象
function getApprovalobect(){
	var approvalObject=new Object();
	approvalObject.businessType="08";
	approvalObject.proposerType=$(parent.frames["topFrame"].document).find(".changeRCurrentRole").find("a:eq(0)")[0].id;
	approvalObject.proposerKey=$(parent.frames["topFrame"].document).find(".userName")[0].attributes[0].nodeValue;
	approvalObject.approvalStyl="1";
	return approvalObject;
}

//重置检索
function reSearch(){
	var reObject = new Object();
	reObject.InputIds = "#courseCode,#courseName,#className";
	reObject.normalSelectIds = "#coursesNature";
	reReloadSearchsWithSelect(reObject);
	drawTaskEmptyTable();
}

//初始化页面按钮绑定事件
function btnBind() {
	//提示框取消按钮
	$('.cancelTipBtn,.cancel').unbind('click');
	$('.cancelTipBtn,.cancel').bind('click', function(e) {
		$.hideModal();
		e.stopPropagation();
	});

	//开始检索
	$('#startSearch').unbind('click');
	$('#startSearch').bind('click', function(e) {
		startSearch();
		e.stopPropagation();
	});

	//重置检索
	$('#reSearch').unbind('click');
	$('#reSearch').bind('click', function(e) {
		reSearch();
		e.stopPropagation();
	});

	//提示框取消按钮
	$('#configExams').unbind('click');
	$('#configExams').bind('click', function(e) {
		askForExams();
		e.stopPropagation();
	});
}